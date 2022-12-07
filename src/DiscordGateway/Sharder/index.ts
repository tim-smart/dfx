import { millis } from "@fp-ts/data/Duration"
import { overridePull } from "callbag-effect-ts/Source"
import { ShardStore } from "../ShardStore/index.js"

const configs = (totalCount: number) =>
  Do(($) => {
    const store = $(Effect.service(ShardStore))
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
  })

const spawnEffect = Effect.structPar({
  gateway: rest
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
  config: Config.gateway,
  limiter: Effect.service(RateLimit.RateLimiter),
})
  .bind("configs", ({ gateway, config }) =>
    configs(config.shardCount ?? gateway.shards),
  )
  .map(({ gateway, config, configs, limiter }) => {
    const [source, pull] = overridePull(
      configs,
      gateway.session_start_limit.max_concurrency,
    )

    return source
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
              `gateway.sharder.${key}`,
              millis(config.identifyRateLimit[0]),
              config.identifyRateLimit[1],
            ),
          )
          .mapEffect((c) => Shard.make([c.id, c.totalCount])),
      )
      .tap(() => Effect.sync(pull))
  })

export const spawn = spawnEffect.unwrap.chainPar((shard) =>
  EffectSource.of(shard).merge(EffectSource.fromEffect(shard.run).drain),
)
