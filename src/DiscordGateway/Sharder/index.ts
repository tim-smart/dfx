import { empty, overridePull, unwrap } from "callbag-effect-ts/Source"
import { millis } from "@fp-ts/data/Duration"
import { ShardStore } from "../ShardStore/index.js"

const configs = (totalCount: number) =>
  Do(($) => {
    const store = $(Effect.service(ShardStore))
    return EffectSource.resource(0, (sharderCount) =>
      pipe(
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
              [Maybe<number>, EffectSource<never, never, number>]
            > =>
              a.match(
                () => Effect.succeed([Maybe.some(sharderCount), empty]),
                (id) =>
                  Effect.succeed([
                    Maybe.some(sharderCount + 1),
                    EffectSource.of(id),
                  ]),
              ),
          ),
        EffectSource.fromEffect,
      ),
    ).map((id) => ({
      id,
      totalCount,
    }))
  })

const spawnEffect = Effect.structPar({
  gateway: Rest.rest
    .getGatewayBot()
    .map((r) => r.data)
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
  limiter: Effect.service(RateLimitStore.RateLimiter),
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
          .mapEffect((c) => Shard.make([c.id, c.totalCount]))
          .tap(() => Effect.sync(pull)),
      )
  })

export const spawn = pipe(spawnEffect, unwrap).chainPar((shard) =>
  EffectSource.of(shard).merge(EffectSource.fromEffect(shard.run).drain),
)
