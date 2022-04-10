import * as T from "@effect-ts/core/Effect"
import * as CB from "callbag-effect-ts"
import * as L from "@effect-ts/core/Effect/Layer"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import { tag } from "@effect-ts/system/Has"
import * as Memory from "./memory"
import { delayFrom } from "./utils"
import { logDebug } from "../Log"

export type BucketDetails = {
  key: "global" | string
  resetAfter: number
  limit: number
}

export interface RateLimitStore {
  hasBucket: (bucketKey: string) => T.UIO<boolean>
  putBucket: (bucket: BucketDetails) => T.UIO<void>

  getBucketForRoute: (route: string) => T.UIO<O.Option<BucketDetails>>
  putBucketRoute: (route: string, bucketKey: string) => T.UIO<void>

  incrementCounter: (
    key: string,
    window: number,
    limit: number,
  ) => T.UIO<readonly [count: number, ttl: number]>
}

export const RateLimitStore = tag<RateLimitStore>("RateLimitStore")

export const LiveMemoryRateLimitStore = L.fromFunction(RateLimitStore)(
  Memory.make,
)

export const maybeWait = (key: string, window: number, limit: number) =>
  T.accessServiceM(RateLimitStore)((s) =>
    pipe(
      s.incrementCounter(key, window, limit),
      T.map(([count, ttl]) => delayFrom(window, limit, count, ttl)),
      T.tap((d) => logDebug("RateLimitStore maybeWait", key, window, limit, d)),
      T.chain(T.sleep),
    ),
  )

export const maybeWaitCB = <A>(key: string, window: number, limit: number) =>
  CB.tap((_: A) => maybeWait(key, window, limit))
