import { millis } from "@effect/data/Duration"
import { ShardStore } from "./ShardStore.js"

const make = Do($ => {
  const store = $(Effect.service(ShardStore))
  const rest = $(Effect.service(DiscordREST))
  const { gateway: config } = $(Effect.service(DiscordConfig.DiscordConfig))
  const limiter = $(Effect.service(RateLimiter))

  const configs = (totalCount: number) => {
    const claimId = (sharderCount: number): Effect<never, never, number> =>
      store
        .claimId({
          totalCount,
          sharderCount,
        })
        .flatMap(a =>
          a.match(
            () => claimId(sharderCount).delay(Duration.minutes(3)),
            id => Effect.succeed(id),
          ),
        )

    return Stream.unfoldEffect(0, sharderCount =>
      claimId(sharderCount).map(id =>
        Maybe.some([id, sharderCount + 1] as const),
      ),
    ).map(id => ({
      id,
      totalCount,
    }))
  }

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

  const shards = $(
    configs(config.shardCount ?? gateway.shards)
      .map(config => ({
        ...config,
        url: gateway.url,
        concurrency: gateway.session_start_limit.max_concurrency,
      }))
      .groupBy(c => Effect.succeed([c.id % c.concurrency, c]))
      .evaluate((key, shardConfig) =>
        shardConfig
          .tap(() =>
            limiter.maybeWait(
              `dfx.sharder.${key}`,
              millis(config.identifyRateLimit[0]),
              config.identifyRateLimit[1],
            ),
          )
          .mapEffect(c => Shard.make([c.id, c.totalCount])),
      )
      .flatMap(shard =>
        Stream.succeed(shard).merge(Stream.fromEffect(shard.run).drain),
      )
      .broadcastDynamic(1),
  )

  return { shards }
})

export interface Sharder extends Effect.Success<typeof make> {}
export const Sharder = Tag<Sharder>()
export const LiveSharder = Layer.scoped(Sharder, make)
