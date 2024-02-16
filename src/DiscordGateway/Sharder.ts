import { DiscordConfig } from "dfx/DiscordConfig"
import type { RunningShard } from "dfx/DiscordGateway/Shard"
import { Shard, ShardLive } from "dfx/DiscordGateway/Shard"
import { ShardStore } from "dfx/DiscordGateway/ShardStore"
import { DiscordREST, DiscordRESTLive } from "dfx/DiscordREST"
import { RateLimiter, RateLimiterLive } from "dfx/RateLimit"
import type * as Discord from "dfx/types"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as HashSet from "effect/HashSet"
import * as Layer from "effect/Layer"
import type * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"

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

  const totalCount = config.shardCount ?? gateway.shards
  const currentCount = yield* _(Ref.make(0))
  const claimId = (sharderCount: number): Effect.Effect<number> =>
    pipe(
      store.claimId({
        totalCount,
        sharderCount,
      }),
      Effect.repeat(claimRepeatPolicy),
      Effect.map(_ => _.value),
    )
  const takeConfig = pipe(
    Ref.getAndUpdate(currentCount, _ => _ + 1),
    Effect.flatMap(claimId),
    Effect.map(
      id =>
        ({
          id,
          totalCount,
        }) as const,
    ),
  )

  const spawner = pipe(
    takeConfig,
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
    Effect.flatMap(c => shard.connect([c.id, c.totalCount])),
    Effect.flatMap(shard => Ref.update(currentShards, HashSet.add(shard))),
    Effect.forever,
  )

  yield* _(
    Effect.replicateEffect(
      spawner,
      gateway.session_start_limit.max_concurrency,
      { concurrency: "unbounded", discard: true },
    ),
    Effect.scoped,
    Effect.catchAllCause(Effect.logError),
    Effect.ensuring(Ref.set(currentShards, HashSet.empty())),
    Effect.forever,
    Effect.forkScoped,
  )

  return { shards: Ref.get(currentShards) } as const
}).pipe(
  Effect.annotateLogs({
    package: "dfx",
    module: "DiscordGateway/Sharder",
  }),
)

export interface Sharder {
  readonly _: unique symbol
}
export const Sharder = GenericTag<Sharder, Effect.Effect.Success<typeof make>>(
  "dfx/DiscordGateway/Sharder",
)
export const SharderLive = Layer.scoped(Sharder, make).pipe(
  Layer.provide(DiscordRESTLive),
  Layer.provide(RateLimiterLive),
  Layer.provide(ShardLive),
)
