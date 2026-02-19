import { DiscordConfig } from "../DiscordConfig.ts"
import type { RunningShard } from "./Shard.ts"
import { Shard, ShardLive } from "./Shard.ts"
import { ShardStore } from "./ShardStore.ts"
import { DiscordREST, DiscordRESTLive } from "../DiscordREST.ts"
import { RateLimiter, RateLimiterLive } from "../RateLimit.ts"
import type * as Discord from "../types.ts"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import type * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"
import * as ServiceMap from "effect/ServiceMap"

const claimRepeatPolicy = Schedule.identity<Option.Option<number>>().pipe(
  Schedule.either(Schedule.spaced("3 minutes")),
  Schedule.while(_ => Effect.succeed(_.input._tag === "None")),
  Schedule.passthrough,
) as Schedule.Schedule<Option.Some<number>, Option.Option<number>>

const make = Effect.gen(function* () {
  const store = yield* ShardStore
  const rest = yield* DiscordREST
  const { gateway: config } = yield* DiscordConfig
  const limiter = yield* RateLimiter
  const shard = yield* Shard
  const currentShards = new Set<RunningShard>()

  const gateway = yield* rest.getBotGateway().pipe(
    Effect.catch(() =>
      Effect.succeed<Discord.APIGatewayBotInfo>({
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
  const currentCount = yield* Ref.make(0)
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
    Effect.map(id => ({ id, totalCount }) as const),
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
    Effect.tap(shard => {
      currentShards.add(shard)
      return Effect.void
    }),
    Effect.forever,
  )

  yield* Effect.replicateEffect(
    spawner,
    gateway.session_start_limit.max_concurrency,
    { concurrency: "unbounded", discard: true },
  ).pipe(
    Effect.scoped,
    Effect.catchCause(Effect.logError),
    Effect.ensuring(Effect.sync(() => currentShards.clear())),
    Effect.forever,
    Effect.forkScoped,
  )

  return {
    shards: Effect.sync(() => currentShards as ReadonlySet<RunningShard>),
  } as const
}).pipe(
  Effect.annotateLogs({
    package: "dfx",
    module: "DiscordGateway/Sharder",
  }),
)

export class Sharder extends ServiceMap.Service<
  Sharder,
  {
    readonly shards: Effect.Effect<ReadonlySet<RunningShard>, never, never>
  }
>()("dfx/DiscordGateway/Sharder") {}

export const SharderLive = Layer.effect(Sharder, make).pipe(
  Layer.provide(DiscordRESTLive),
  Layer.provide(RateLimiterLive),
  Layer.provide(ShardLive),
)
