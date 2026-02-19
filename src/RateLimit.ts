import * as Duration from "effect/Duration"
import type * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Memory from "./RateLimit/memory.ts"
import { delayFrom } from "./RateLimit/utils.ts"
import * as ServiceMap from "effect/ServiceMap"

export type BucketDetails = {
  key: "global" | string
  resetAfter: number
  limit: number
}

export interface RateLimitStoreService {
  readonly hasBucket: (bucketKey: string) => Effect.Effect<boolean>

  readonly putBucket: (bucket: BucketDetails) => Effect.Effect<void>

  readonly getBucketForRoute: (
    route: string,
  ) => Effect.Effect<Option.Option<BucketDetails>>

  readonly putBucketRoute: (
    route: string,
    bucketKey: string,
  ) => Effect.Effect<void>

  readonly incrementCounter: (
    key: string,
    window: number,
    limit: number,
  ) => Effect.Effect<readonly [count: number, ttl: number]>

  readonly removeCounter: (key: string) => Effect.Effect<void>
}

export class RateLimitStore extends ServiceMap.Service<
  RateLimitStore,
  RateLimitStoreService
>()("dfx/RateLimit/RateLimitStore") {}

export const MemoryRateLimitStoreLive = Layer.sync(RateLimitStore, Memory.make)

const makeLimiter = Effect.gen(function* () {
  const store = yield* RateLimitStore

  const maybeWait = (
    key: string,
    window: Duration.Duration,
    limit: number,
    multiplier = 1.05,
  ) => {
    const windowMs = Duration.toMillis(window) * multiplier

    return store.incrementCounter(key, windowMs, limit).pipe(
      Effect.map(([count, ttl]) => delayFrom(windowMs, limit, count, ttl)),
      Effect.tap(d =>
        Effect.annotateLogs(Effect.logTrace("maybeWait"), {
          service: "RateLimit",
          key,
          window: Duration.toMillis(window),
          windowMs,
          limit,
          delay: Duration.toMillis(d),
        }),
      ),
      Effect.tap(_ =>
        Duration.toMillis(_) === 0 ? Effect.void : Effect.sleep(_),
      ),
      Effect.asVoid,
    )
  }

  return { maybeWait }
})

export class RateLimiter extends ServiceMap.Service<
  RateLimiter,
  {
    maybeWait: (
      key: string,
      window: Duration.Duration,
      limit: number,
      multiplier?: number,
    ) => Effect.Effect<void, never, never>
  }
>()("dfx/RateLimit/RateLimiter") {}

export const RateLimiterLive = Layer.effect(RateLimiter, makeLimiter)
