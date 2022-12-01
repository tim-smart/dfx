import { delayFrom } from "./utils.js"
import * as Memory from "./memory.js"

export type BucketDetails = {
  key: "global" | string
  resetAfter: number
  limit: number
}

export interface RateLimitStore {
  hasBucket: (bucketKey: string) => Effect<never, never, boolean>

  putBucket: (bucket: BucketDetails) => Effect<never, never, void>

  getBucketForRoute: (
    route: string,
  ) => Effect<never, never, Maybe<BucketDetails>>

  putBucketRoute: (
    route: string,
    bucketKey: string,
  ) => Effect<never, never, void>

  incrementCounter: (
    key: string,
    window: number,
    limit: number,
  ) => Effect<never, never, readonly [count: number, ttl: number]>
}

export const RateLimitStore = Tag<RateLimitStore>()
export const LiveMemoryRateLimitStore = Layer.sync(RateLimitStore)(Memory.make)

const makeLimiter = Do(($) => {
  const store = $(Effect.service(RateLimitStore))
  const log = $(Effect.service(Log.Log))

  const maybeWait = (key: string, window: Duration, limit: number) =>
    store
      .incrementCounter(key, window.millis, limit)
      .map(([count, ttl]) => delayFrom(window.millis, limit, count, ttl))
      .tap((d) =>
        log.debug(
          "RateLimitStore maybeWait",
          key,
          window.millis,
          limit,
          d.millis,
        ),
      )
      .tap(Effect.sleep).asUnit

  return { maybeWait }
})

export interface RateLimiter extends Success<typeof makeLimiter> {}
export const RateLimiter = Tag<RateLimiter>()
export const LiveRateLimiter = Layer.fromEffect(RateLimiter)(makeLimiter)
