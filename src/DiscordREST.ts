import { DiscordConfig } from "./DiscordConfig.ts"
import {
  rateLimitFromHeaders,
  retryAfter,
  routeFromConfig,
} from "./DiscordREST/utils.ts"
import { RateLimitStore, RateLimiter, RateLimiterLive } from "./RateLimit.ts"
import * as Discord from "./types.ts"
import { LIB_VERSION } from "./version.ts"
import * as Duration from "effect/Duration"
import { millis } from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Fiber from "effect/Fiber"
import { flow } from "effect/Function"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Redacted from "effect/Redacted"
import * as ServiceMap from "effect/ServiceMap"
import * as HttpBody from "effect/unstable/http/HttpBody"
import * as HttpClient from "effect/unstable/http/HttpClient"
import type { HttpClientError } from "effect/unstable/http/HttpClientError"
import * as HttpRequest from "effect/unstable/http/HttpClientRequest"
import type * as HttpResponse from "effect/unstable/http/HttpClientResponse"

const make = Effect.gen(function* () {
  const { rest, token } = yield* DiscordConfig

  const store = yield* RateLimitStore
  const { maybeWait } = yield* RateLimiter

  const globalRateLimit = maybeWait(
    "dfx.rest.global",
    Duration.fromInputUnsafe(rest.globalRateLimit.window),
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
      Effect.andThen(
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
    const fibers: Array<Fiber.Fiber<unknown, unknown>> = []

    badRoutes.delete(route)
    fibers.push(
      yield* Effect.forkChild(store.putBucketRoute(route, rateLimit.bucket)),
    )

    if (!hasBucket || rateLimit.limit - 1 === rateLimit.remaining) {
      fibers.push(
        yield* Effect.forkChild(store.removeCounter(`dfx.rest.?.${route}`)),
      )
      fibers.push(
        yield* Effect.forkChild(
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

    yield* Fiber.awaitAll(fibers)
  })

  const defaultClient = (yield* HttpClient.HttpClient).pipe(
    HttpClient.transformResponse(
      Effect.provideService(HttpClient.TracerPropagationEnabled, false),
    ),
  )
  const rateLimitedClient: HttpClient.HttpClient = defaultClient.pipe(
    HttpClient.tapRequest(request =>
      Effect.andThen(requestRateLimit(request.url, request), globalRateLimit),
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
                Effect.andThen(
                  addBadRoute(routeFromConfig(request.url, request.method)),
                ),
                Effect.andThen(updateBuckets(request, response)),
                Effect.andThen(
                  Effect.sleep(
                    Option.getOrElse(retryAfter(response.headers), () =>
                      Duration.seconds(5),
                    ),
                  ),
                ),
                Effect.andThen(rateLimitedClient.execute(request)),
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

  const httpClient = HttpClient.mapRequestInputEffect(rateLimitedClient, req =>
    Effect.sync(() => {
      const fiber = Fiber.getCurrent()!
      let request = req.pipe(
        HttpRequest.prependUrl(rest.baseUrl),
        HttpRequest.setHeaders({
          Authorization: `Bot ${Redacted.value(token)}`,
          "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${LIB_VERSION})`,
        }),
      )
      const formData = ServiceMap.getOption(fiber.services, DiscordFormData)
      if (Option.isSome(formData)) {
        if (request.body._tag === "Uint8Array") {
          formData.value.set(
            "payload_json",
            new Blob([request.body.body as Uint8Array<ArrayBuffer>], {
              type: "application/json",
            }),
            "",
          )
        }
        request = HttpRequest.setBody(
          request,
          HttpBody.formData(formData.value),
        )
      }
      return request
    }),
  )

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

export type DiscordRESTError =
  | HttpClientError
  | Discord.DiscordRestError<"RatelimitedResponse", Discord.RatelimitedResponse>
  | Discord.DiscordRestError<"ErrorResponse", Discord.ErrorResponse>

export class DiscordFormData extends ServiceMap.Service<
  DiscordFormData,
  FormData
>()("dfx/DiscordREST/DiscordFormData") {}

export interface DiscordRestService extends Discord.DiscordRest {
  withFormData(
    formData: FormData,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
  withFiles(
    files: ReadonlyArray<File>,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
}

export class DiscordREST extends ServiceMap.Service<
  DiscordREST,
  DiscordRestService
>()("dfx/DiscordREST") {}

export const DiscordRESTLive: Layer.Layer<
  DiscordREST,
  never,
  DiscordConfig | HttpClient.HttpClient | RateLimitStore
> = Layer.effect(DiscordREST, make).pipe(Layer.provide(RateLimiterLive))
