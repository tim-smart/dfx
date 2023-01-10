import { delayFrom } from "./utils.js"
import * as Memory from "./memory.js"
import { Success } from "dfx/utils/effect"

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

  removeCounter: (key: string) => Effect<never, never, void>
}

export const RateLimitStore = Tag<RateLimitStore>()
export const LiveMemoryRateLimitStore = Layer.sync(RateLimitStore)(Memory.make)

const makeLimiter = Do(($) => {
  const store = $(Effect.service(RateLimitStore))
  const log = $(Effect.service(Log.Log))

  const maybeWait = (
    key: string,
    window: Duration,
    limit: number,
    multiplier = 1.05,
  ) => {
    const windowMs = window.millis * multiplier

    return store
      .incrementCounter(key, windowMs, limit)
      .map(([count, ttl]) => delayFrom(windowMs, limit, count, ttl))
      .tap((d) =>
        log.debug("RateLimitStore maybeWait", {
          key,
          window: window.millis,
          windowMs,
          limit,
          delay: d.millis,
        }),
      )
      .tap(Effect.sleep).asUnit
  }

  return { maybeWait }
})

export interface RateLimiter extends Success<typeof makeLimiter> {}
export const RateLimiter = Tag<RateLimiter>()
export const LiveRateLimiter = Layer.fromEffect(RateLimiter)(makeLimiter)
