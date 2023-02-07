import { BucketDetails, RateLimitStore } from "./index.js"

interface Counter {
  count: number
  expires: number
}

export const make = (): RateLimitStore => {
  const buckets = new Map<string, BucketDetails>()
  const routes = new Map<string, string>()
  const counters = new Map<string, Counter>()

  const getCounter = (key: string) =>
    Maybe.fromNullable(counters.get(key)).filter(c => c.expires > Date.now())

  const getBucketForRoute = (route: string) =>
    Effect.sync(() => Maybe.fromNullable(buckets.get(routes.get(route)!)))

  return {
    hasBucket: key => Effect.sync(() => buckets.has(key)),

    putBucket: bucket =>
      Effect.sync(() => {
        buckets.set(bucket.key, bucket)
      }),

    getBucketForRoute,

    putBucketRoute: (route, bucket) =>
      Effect.sync(() => {
        routes.set(route, bucket)
      }),

    removeCounter: key =>
      Effect.sync(() => {
        counters.delete(key)
      }),

    incrementCounter: (key, window, limit) =>
      Effect.sync(() => {
        const now = Date.now()
        const perRequest = Math.ceil(window / limit)
        const counter = getCounter(key).getOrElse(
          (): Counter => ({
            expires: now,
            count: 0,
          }),
        )

        const count = counter.count + 1
        const expires = counter.expires + perRequest
        counters.set(key, { ...counter, count, expires })

        return [count, expires - now]
      }),
  }
}
