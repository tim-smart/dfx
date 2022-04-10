import { BucketDetails, RateLimitStore } from "./index"
import * as T from "@effect-ts/core/Effect"
import * as O from "@effect-ts/core/Option"
import { pipe } from "@effect-ts/core/Function"

interface Counter {
  count: number
  expires: number
}

export const make = (): RateLimitStore => {
  const buckets = new Map<string, BucketDetails>()
  const routes = new Map<string, string>()
  const counters = new Map<string, Counter>()

  const getCounter = (key: string) =>
    pipe(
      counters.get(key),
      O.fromNullable,
      O.filter((c) => c.expires > Date.now()),
    )

  return {
    hasBucket: (key) => T.succeedWith(() => buckets.has(key)),

    putBucket: (bucket) =>
      T.succeedWith(() => {
        buckets.set(bucket.key, bucket)
      }),

    getBucketForRoute: (route) =>
      T.succeedWith(() => O.fromNullable(buckets.get(routes.get(route)!))),

    putBucketRoute: (route, bucket) =>
      T.succeedWith(() => {
        routes.set(route, bucket)
      }),

    incrementCounter: (key, window, limit) =>
      T.succeedWith(() => {
        const now = Date.now()
        const perRequest = Math.ceil(window / limit)
        const counter = O.getOrElse_(getCounter(key), () => ({
          expires: now,
          count: 0,
        }))

        const count = counter.count + 1
        const expires = counter.expires + perRequest
        counters.set(key, { ...counter, count, expires })

        return [count, expires - now]
      }),
  }
}
