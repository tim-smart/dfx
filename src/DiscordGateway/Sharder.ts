import * as Chunk from "@effect/data/Chunk"
import { Tag } from "@effect/data/Context"
import * as Duration from "@effect/data/Duration"
import { pipe } from "@effect/data/Function"
import * as HashSet from "@effect/data/HashSet"
import type * as Option from "@effect/data/Option"
import * as Deferred from "@effect/io/Deferred"
import * as Effect from "@effect/io/Effect"
import type * as Hub from "@effect/io/Hub"
import * as Layer from "@effect/io/Layer"
import type * as Queue from "@effect/io/Queue"
import * as Ref from "@effect/io/Ref"
import * as Schedule from "@effect/io/Schedule"
import { DiscordConfig } from "dfx/DiscordConfig"
import type { RunningShard } from "dfx/DiscordGateway/Shard"
import { LiveShard, Shard } from "dfx/DiscordGateway/Shard"
import { ShardStore } from "dfx/DiscordGateway/ShardStore"
import type { WebSocketCloseError, WebSocketError } from "dfx/DiscordGateway/WS"
import { DiscordREST } from "dfx/DiscordREST"
import { LiveRateLimiter, RateLimiter } from "dfx/RateLimit"
import type * as Discord from "dfx/types"

const claimRepeatPolicy = Schedule.spaced("3 minutes").pipe(
  Schedule.whileInput((_: Option.Option<number>) => _._tag === "None"),
  Schedule.passthrough,
) as Schedule.Schedule<never, Option.Option<number>, Option.Some<number>>

const make = Effect.gen(function* (_) {
  const store = yield* _(ShardStore)
  const rest = yield* _(DiscordREST)
  const { gateway: config } = yield* _(DiscordConfig)
  const limiter = yield* _(RateLimiter)
  const shard = yield* _(Shard)
  const currentShards = yield* _(Ref.make(HashSet.empty<RunningShard>()))

  const takeConfig = (totalCount: number) =>
    Effect.gen(function* (_) {
      const currentCount = yield* _(Ref.make(0))

      const claimId = (
        sharderCount: number,
      ): Effect.Effect<never, never, number> =>
        pipe(
          store.claimId({
            totalCount,
            sharderCount,
          }),
          Effect.repeat(claimRepeatPolicy),
          Effect.map(_ => _.value),
        )

      return pipe(
        Ref.getAndUpdate(currentCount, _ => _ + 1),
        Effect.flatMap(claimId),
        Effect.map(id => ({ id, totalCount }) as const),
      )
    })

  const gateway = yield* _(
    rest.getGatewayBot(),
    Effect.flatMap(r => r.json),
    Effect.catchAll(() =>
      Effect.succeed<Discord.GetGatewayBotResponse>({
        url: "wss://gateway.discord.gg/",
        shards: 1,
        session_start_limit: {
          total: 0,
          remaining: 0,
          reset_after: 0,
          max_concurrency: 1,
        },
      }),
    ),
  )

  const run = (
    hub: Hub.Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
    sendQueue: Queue.Dequeue<Discord.GatewayPayload<Discord.SendEvent>>,
  ) =>
    Effect.gen(function* (_) {
      const deferred = yield* _(
        Deferred.make<WebSocketError | WebSocketCloseError, never>(),
      )
      const take = yield* _(takeConfig(config.shardCount ?? gateway.shards))

      const spawner = pipe(
        take,
        Effect.map(config => ({
          ...config,
          url: gateway.url,
          concurrency: gateway.session_start_limit.max_concurrency,
        })),
        Effect.tap(({ concurrency, id }) =>
          limiter.maybeWait(
            `dfx.sharder.${id % concurrency}`,
            Duration.millis(config.identifyRateLimit[0]),
            config.identifyRateLimit[1],
          ),
        ),
        Effect.flatMap(c =>
          shard.connect([c.id, c.totalCount], hub, sendQueue),
        ),
        Effect.flatMap(shard =>
          Effect.acquireUseRelease(
            Ref.update(currentShards, HashSet.add(shard)),
            () => shard.run,
            () => Ref.update(currentShards, HashSet.remove(shard)),
          ).pipe(
            Effect.catchAllCause(_ => Deferred.failCause(deferred, _)),
            Effect.fork,
          ),
        ),
        Effect.forever,
      )

      const spawners = Chunk.map(
        Chunk.range(1, gateway.session_start_limit.max_concurrency),
        () => spawner,
      )

      return yield* _(
        Effect.all(
          [
            Effect.all(spawners, { concurrency: "unbounded", discard: true }),
            Deferred.await(deferred),
          ],
          { concurrency: "unbounded", discard: true },
        ) as Effect.Effect<never, WebSocketError | WebSocketCloseError, never>,
      )
    })

  return { shards: Ref.get(currentShards), run } as const
})

export interface Sharder extends Effect.Effect.Success<typeof make> {}
export const Sharder = Tag<Sharder>()
export const LiveSharder = Layer.provide(
  Layer.merge(LiveRateLimiter, LiveShard),
  Layer.effect(Sharder, make),
)
