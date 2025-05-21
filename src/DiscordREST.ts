import * as HttpBody from "@effect/platform/HttpBody"
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
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Redacted from "effect/Redacted"
import { flow } from "effect/Function"
import * as Context from "effect/Context"
import * as Fiber from "effect/Fiber"
import { HttpClientRequest } from "@effect/platform/index"

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
  const badRoutes = new Set<string>()
  const tenMinutes = Duration.minutes(10)
  const tenMinutesMillis = Duration.toMillis(tenMinutes)
  const addBadRoute = (route: string) =>
    Effect.suspend(() => {
      badRoutes.add(route)
      return Effect.log("bad route")
    }).pipe(
      Effect.zipRight(
        store.incrementCounter("dfx.rest.invalid", tenMinutesMillis, 10000),
      ),
      Effect.annotateLogs("route", route),
    )

  const invalidRateLimit = (route: string) =>
    Effect.suspend(() =>
      badRoutes.has(route)
        ? maybeWait("dfx.rest.invalid", tenMinutes, 10000)
        : Effect.void,
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

    badRoutes.delete(route)
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

    for (const fiber of fibers) {
      if (!fiber.unsafePoll()) {
        yield* fiber.await
      }
    }
  })

  const defaultClient = yield* HttpClient.HttpClient
  const rateLimitedClient: HttpClient.HttpClient = defaultClient.pipe(
    HttpClient.tapRequest(request =>
      Effect.zipRight(requestRateLimit(request.url, request), globalRateLimit),
    ),
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
                Effect.zipRight(rateLimitedClient.execute(request)),
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

  const httpClient = HttpClient.mapRequestInput(rateLimitedClient, req => {
    const fiber = Option.getOrThrow(Fiber.getCurrentFiber())
    let request = req.pipe(
      HttpRequest.prependUrl(rest.baseUrl),
      HttpRequest.setHeaders({
        Authorization: `Bot ${Redacted.value(token)}`,
        "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${LIB_VERSION})`,
      }),
    )
    const formData = Context.getOption(fiber.currentContext, DiscordFormData)
    if (Option.isSome(formData)) {
      if (request.body._tag === "Uint8Array") {
        formData.value.set(
          "payload_json",
          new Blob([request.body.body], { type: "application/json" }),
          "",
        )
      }
      request = HttpClientRequest.setBody(
        request,
        HttpBody.formData(formData.value),
      )
    }
    return request
  })

  return DiscordREST.of({
    ...Discord.make(httpClient),
    withFormData(formData) {
      return Effect.provideService(DiscordFormData, formData)
    },
    withFiles(files) {
      return <A, E, R>(
        effect: Effect.Effect<A, E, R>,
      ): Effect.Effect<A, E, R> =>
        Effect.suspend(() => {
          const formData = new FormData()
          for (let i = 0; i < files.length; i++) {
            formData.append(`files[${i}]`, files[i])
          }
          return Effect.provideService(effect, DiscordFormData, formData)
        })
    },
  })
})

export class DiscordFormData extends Context.Tag("DiscordFormData")<
  DiscordFormData,
  FormData
>() {}

export interface DiscordREST {
  readonly _: unique symbol
}

export interface DiscordRestService extends Discord.DiscordRest {
  withFormData(
    formData: FormData,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
  withFiles(
    files: ReadonlyArray<File>,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
}

export const DiscordREST = GenericTag<DiscordREST, DiscordRestService>(
  "dfx/DiscordREST",
)
export const DiscordRESTLive: Layer.Layer<
  DiscordREST,
  never,
  DiscordConfig | HttpClient.HttpClient | RateLimitStore
> = Layer.effect(DiscordREST, make).pipe(Layer.provide(RateLimiterLive))
