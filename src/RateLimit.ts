import { Tag } from "@effect/data/Context"
import * as Duration from "@effect/data/Duration"
import type * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import { Log } from "dfx/Log"
import * as Memory from "dfx/RateLimit/memory"
import { delayFrom } from "dfx/RateLimit/utils"

export type BucketDetails = {
  key: "global" | string
  resetAfter: number
  limit: number
}

export interface RateLimitStore {
  readonly hasBucket: (
    bucketKey: string,
  ) => Effect.Effect<never, never, boolean>

  readonly putBucket: (
    bucket: BucketDetails,
  ) => Effect.Effect<never, never, void>

  readonly getBucketForRoute: (
    route: string,
  ) => Effect.Effect<never, never, Option.Option<BucketDetails>>

  readonly putBucketRoute: (
    route: string,
    bucketKey: string,
  ) => Effect.Effect<never, never, void>

  readonly incrementCounter: (
    key: string,
    window: number,
    limit: number,
  ) => Effect.Effect<never, never, readonly [count: number, ttl: number]>

  readonly removeCounter: (key: string) => Effect.Effect<never, never, void>
}

export const RateLimitStore = Tag<RateLimitStore>()
export const LiveMemoryRateLimitStore = Layer.sync(RateLimitStore, Memory.make)

const makeLimiter = Effect.gen(function*(_) {
  const store = yield* _(RateLimitStore)
  const log = yield* _(Log)

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
        log.debug("RateLimitStore maybeWait", {
          key,
          window: Duration.toMillis(window),
          windowMs,
          limit,
          delay: Duration.toMillis(d),
        })
      ),
      Effect.tap(_ =>
        Duration.toMillis(_) === 0 ? Effect.unit : Effect.sleep(_)
      ),
      Effect.asUnit,
    )
  }

  return { maybeWait }
})

export interface RateLimiter
  extends Effect.Effect.Success<typeof makeLimiter>
{}
export const RateLimiter = Tag<RateLimiter>()
export const LiveRateLimiter = Layer.effect(RateLimiter, makeLimiter)
