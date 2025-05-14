import * as HttpClient from "@effect/platform/HttpClient"
import * as HttpRequest from "@effect/platform/HttpClientRequest"
import type * as HttpResponse from "@effect/platform/HttpClientResponse"
import { DiscordConfig } from "dfx/DiscordConfig"
import {
  rateLimitFromHeaders,
  retryAfter,
  routeFromConfig,
} from "dfx/DiscordREST/utils"
import { RateLimitStore, RateLimiter, RateLimiterLive } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import { LIB_VERSION } from "dfx/version"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import { millis } from "effect/Duration"
import * as Effect from "effect/Effect"
import * as HashSet from "effect/HashSet"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import * as Redacted from "effect/Redacted"
import type * as Fiber from "effect/Fiber"
import { flow } from "effect/Function"

const make = Effect.gen(function* () {
  const { rest, token } = yield* DiscordConfig

  const store = yield* RateLimitStore
  const { maybeWait } = yield* RateLimiter

  const globalRateLimit = maybeWait(
    "dfx.rest.global",
    Duration.decode(rest.globalRateLimit.window),
    rest.globalRateLimit.limit,
  )

  // Invalid route handling (40x)
  const badRoutesRef = yield* Ref.make(HashSet.empty<string>())
  const tenMinutes = Duration.toMillis(Duration.minutes(10))
  const addBadRoute = (route: string) =>
    Effect.logDebug("bad route").pipe(
      Effect.zipRight(Ref.update(badRoutesRef, HashSet.add(route))),
      Effect.zipRight(
        store.incrementCounter("dfx.rest.invalid", tenMinutes, 10000),
      ),
      Effect.annotateLogs("route", route),
    )
  const isBadRoute = (route: string) =>
    Effect.map(Ref.get(badRoutesRef), HashSet.has(route))
  const removeBadRoute = (route: string) =>
    Ref.update(badRoutesRef, HashSet.remove(route))

  const invalidRateLimit = (route: string) =>
    isBadRoute(route).pipe(
      Effect.tap(invalid =>
        invalid
          ? maybeWait("dfx.rest.invalid", Duration.minutes(10), 10000)
          : Effect.void,
      ),
      Effect.asVoid,
    )

  // Request rate limiting
  const requestRateLimit = Effect.fnUntraced(function* (
    path: string,
    request: HttpRequest.HttpClientRequest,
  ) {
    const route = routeFromConfig(path, request.method)
    const maybeBucket = yield* store.getBucketForRoute(route)
    yield* invalidRateLimit(route)
    if (Option.isNone(maybeBucket)) return
    const bucket = maybeBucket.value
    yield* maybeWait(
      `dfx.rest.${bucket.key}`,
      millis(bucket.resetAfter),
      bucket.limit,
    )
  })

  // Update rate limit buckets
  const updateBuckets = Effect.fnUntraced(function* (
    request: HttpRequest.HttpClientRequest,
    response: HttpResponse.HttpClientResponse,
  ) {
    const route = routeFromConfig(request.url, request.method)
    const rateLimitOption = rateLimitFromHeaders(response.headers)
    if (Option.isNone(rateLimitOption)) return
    const rateLimit = rateLimitOption.value
    const hasBucket = yield* store.hasBucket(rateLimit.bucket)
    const fibers: Array<Fiber.RuntimeFiber<unknown, unknown>> = []

    fibers.push(yield* Effect.fork(removeBadRoute(route)))
    fibers.push(
      yield* Effect.fork(store.putBucketRoute(route, rateLimit.bucket)),
    )

    if (!hasBucket || rateLimit.limit - 1 === rateLimit.remaining) {
      fibers.push(
        yield* Effect.fork(store.removeCounter(`dfx.rest.?.${route}`)),
      )
      fibers.push(
        yield* Effect.fork(
          store.putBucket({
            key: rateLimit.bucket,
            resetAfter: Duration.toMillis(rateLimit.retryAfter),
            limit:
              !hasBucket && rateLimit.remaining > 0
                ? rateLimit.remaining
                : rateLimit.limit,
          }),
        ),
      )
    }

    for (const fiber of fibers) yield* fiber.await
  })

  const httpClient: HttpClient.HttpClient = (yield* HttpClient.HttpClient).pipe(
    HttpClient.mapRequestEffect(req => {
      const request = req.pipe(
        HttpRequest.prependUrl(rest.baseUrl),
        HttpRequest.setHeaders({
          Authorization: `Bot ${Redacted.value(token)}`,
          "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${LIB_VERSION})`,
        }),
      )
      return requestRateLimit(request.url, request).pipe(
        Effect.zipLeft(globalRateLimit),
        Effect.as(request),
      )
    }),
    HttpClient.transformResponse(
      flow(
        Effect.tap(response => updateBuckets(response.request, response)),
        Effect.flatMap(response => {
          const request = response.request

          switch (response.status) {
            case 403:
              return Effect.as(
                Effect.all(
                  [
                    Effect.annotateLogs(
                      Effect.logDebug("403"),
                      "url",
                      request.url,
                    ),
                    addBadRoute(routeFromConfig(request.url, request.method)),
                    updateBuckets(request, response),
                  ],
                  { concurrency: "unbounded", discard: true },
                ),
                response,
              )

            case 429:
              return Effect.annotateLogs(
                Effect.logDebug("429"),
                "url",
                request.url,
              ).pipe(
                Effect.zipRight(
                  addBadRoute(routeFromConfig(request.url, request.method)),
                ),
                Effect.zipRight(updateBuckets(request, response)),
                Effect.zipRight(
                  Effect.sleep(
                    Option.getOrElse(retryAfter(response.headers), () =>
                      Duration.seconds(5),
                    ),
                  ),
                ),
                Effect.zipRight(httpClient.execute(request)),
              )
          }

          return Effect.succeed(response)
        }),
        Effect.annotateLogs({
          package: "dfx",
          module: "DiscordREST",
        }),
      ),
    ),
  )

  return Discord.make(httpClient)
})

export interface DiscordREST {
  readonly _: unique symbol
}

export const DiscordREST = GenericTag<DiscordREST, Discord.DiscordRest>(
  "dfx/DiscordREST",
)
export const DiscordRESTLive: Layer.Layer<
  DiscordREST,
  never,
  DiscordConfig | HttpClient.HttpClient | RateLimitStore
> = Layer.effect(DiscordREST, make).pipe(Layer.provide(RateLimiterLive))
