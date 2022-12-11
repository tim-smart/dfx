import { millis } from "@fp-ts/data/Duration"
import { overridePull } from "callbag-effect-ts/Source"
import { ShardStore } from "../ShardStore/index.js"

const make = Do(($) => {
  const store = $(Effect.service(ShardStore))
  const { routes: rest } = $(Effect.service(DiscordREST))
  const { gateway: config } = $(Effect.service(Config.DiscordConfig))
  const limiter = $(Effect.service(RateLimit.RateLimiter))

  const configs = (totalCount: number) => {
    const claimId = (sharderCount: number) =>
      store
        .claimId({
          totalCount,
          sharderCount,
        })
        .flatMap(
          (
            a,
          ): Effect<
            never,
            never,
            readonly [Maybe<number>, EffectSource<never, never, number>]
          > =>
            a.match(
              () =>
                Effect.succeed([
                  Maybe.some(sharderCount),
                  EffectSource.empty,
                ] as const).delay(Duration.minutes(3)),
              (id) =>
                Effect.succeed([
                  Maybe.some(sharderCount + 1),
                  EffectSource.of(id),
                ]),
            ),
        )

    return EffectSource.resource(0, (sharderCount) =>
      EffectSource.fromEffect(claimId(sharderCount)),
    ).map((id) => ({
      id,
      totalCount,
    }))
  }

  const gateway = $(
    rest
      .getGatewayBot()
      .flatMap((r) => r.json)
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

  const [source, pull] = overridePull(
    configs(config.shardCount ?? gateway.shards),
    gateway.session_start_limit.max_concurrency,
  )

  const shards = $(
    source
      .map((config) => ({
        ...config,
        url: gateway.url,
        concurrency: gateway.session_start_limit.max_concurrency,
      }))
      .groupBy((c) => c.id % c.concurrency)
      .chainPar(([shardConfig, key]) =>
        shardConfig
          .tap(() =>
            limiter.maybeWait(
              `dfx.sharder.${key}`,
              millis(config.identifyRateLimit[0]),
              config.identifyRateLimit[1],
            ),
          )
          .mapEffect((c) => Shard.make([c.id, c.totalCount])),
      )
      .tap(() => Effect.sync(pull))
      .chainPar((shard) =>
        EffectSource.of(shard).merge(EffectSource.fromEffect(shard.run).drain),
      ).share,
  )

  return { shards }
})

export interface Sharder extends Success<typeof make> {}
export const Sharder = Tag<Sharder>()
export const LiveSharder = make.toLayer(Sharder)
