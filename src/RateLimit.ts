import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import type * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Memory from "dfx/RateLimit/memory"
import { delayFrom } from "dfx/RateLimit/utils"

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

export interface RateLimitStore {
  readonly _: unique symbol
}

export const RateLimitStore = GenericTag<RateLimitStore, RateLimitStoreService>(
  "dfx/RateLimit/RateLimitStore",
)
export const MemoryRateLimitStoreLive = Layer.sync(RateLimitStore, Memory.make)

const makeLimiter = Effect.gen(function* (_) {
  const store = yield* _(RateLimitStore)

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

export interface RateLimiter {
  readonly _: unique symbol
}
export const RateLimiter = GenericTag<
  RateLimiter,
  Effect.Effect.Success<typeof makeLimiter>
>("dfx/RateLimit/RateLimiter")
export const RateLimiterLive = Layer.effect(RateLimiter, makeLimiter)
