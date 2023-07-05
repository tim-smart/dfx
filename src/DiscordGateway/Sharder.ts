import { millis } from "@effect/data/Duration"
import { DiscordConfig } from "dfx/DiscordConfig"
import { DiscordREST } from "dfx/DiscordREST"
import { LiveRateLimiter, RateLimiter } from "../RateLimit.js"
import { LiveShard, RunningShard, Shard } from "./Shard.js"
import { ShardStore } from "./ShardStore.js"
import { WebSocketCloseError, WebSocketError } from "./WS.js"
import { Some } from "@effect/data/Option"

const claimRepeatPolicy = Schedule.fixed(Duration.minutes(3)).whileInput(
  (_: Maybe<number>) => _.isNone(),
).passthrough as Schedule<never, Maybe<number>, Some<number>>

const make = Do($ => {
  const store = $(ShardStore)
  const rest = $(DiscordREST)
  const { gateway: config } = $(DiscordConfig)
  const limiter = $(RateLimiter)
  const shard = $(Shard)
  const currentShards = $(Ref.make(HashSet.empty<RunningShard>()))

  const takeConfig = (totalCount: number) =>
    Do($ => {
      const currentCount = $(Ref.make(0))

      const claimId = (sharderCount: number): Effect<never, never, number> =>
        store
          .claimId({
            totalCount,
            sharderCount,
          })
          .repeat(claimRepeatPolicy)
          .map(_ => _.value)

      return currentCount
        .getAndUpdate(_ => _ + 1)
        .flatMap(claimId)
        .map(id => ({ id, totalCount } as const))
    })

  const gateway = $(
    rest
      .getGatewayBot()
      .flatMap(r => r.json)
      .catchAll(() =>
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
    hub: Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
    sendQueue: Dequeue<Discord.GatewayPayload<Discord.SendEvent>>,
  ) =>
    Do($ => {
      const deferred = $(
        Deferred.make<WebSocketError | WebSocketCloseError, never>(),
      )
      const take = $(takeConfig(config.shardCount ?? gateway.shards))

      const spawner = take
        .map(config => ({
          ...config,
          url: gateway.url,
          concurrency: gateway.session_start_limit.max_concurrency,
        }))
        .tap(({ id, concurrency }) =>
          limiter.maybeWait(
            `dfx.sharder.${id % concurrency}`,
            millis(config.identifyRateLimit[0]),
            config.identifyRateLimit[1],
          ),
        )
        .flatMap(c => shard.connect([c.id, c.totalCount], hub, sendQueue))
        .flatMap(
          shard =>
            currentShards
              .update(_ => _.add(shard))
              .acquireUseRelease(
                () => shard.run,
                () => currentShards.update(_ => _.remove(shard)),
              )
              .catchAllCause(_ => deferred.failCause(_)).fork,
        ).forever

      const spawners = Chunk.range(
        1,
        gateway.session_start_limit.max_concurrency,
      ).map(() => spawner)

      return $(
        Effect.allParDiscard(spawners).zipParLeft(deferred.await) as Effect<
          never,
          WebSocketError | WebSocketCloseError,
          never
        >,
      )
    })

  return { shards: currentShards.get, run } as const
})

export interface Sharder extends Effect.Success<typeof make> {}
export const Sharder = Tag<Sharder>()
export const LiveSharder =
  (LiveRateLimiter + LiveShard) >> make.toLayer(Sharder)
