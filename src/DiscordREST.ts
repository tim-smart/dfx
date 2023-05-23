import * as Http from "@effect-http/client"
import { millis } from "@effect/data/Duration"
import { DiscordConfig } from "./DiscordConfig.js"
import { ResponseWithData, RestResponse } from "./DiscordREST/types.js"
import {
  rateLimitFromHeaders,
  retryAfter,
  routeFromConfig,
} from "./DiscordREST/utils.js"
import { Log } from "./Log.js"
import {
  BucketDetails,
  LiveRateLimiter,
  RateLimitStore,
  RateLimiter,
} from "./RateLimit.js"
import Pkg from "./package.json" assert { type: "json" }

export class DiscordRESTError {
  readonly _tag = "DiscordRESTError"
  constructor(readonly error: Http.HttpClientError) {}
}

export { ResponseDecodeError } from "@effect-http/client"

const make = Do($ => {
  const { token, rest } = $(DiscordConfig)

  const http = $(Http.HttpRequestExecutor)
  const log = $(Log)
  const store = $(RateLimitStore)
  const { maybeWait } = $(RateLimiter)

  const globalRateLimit = maybeWait(
    "dfx.rest.global",
    rest.globalRateLimit.window,
    rest.globalRateLimit.limit,
  )

  // Invalid route handling (40x)
  const badRoutesRef = $(Ref.make(HashSet.empty<string>()))
  const addBadRoute = (route: string) =>
    Effect.allParDiscard([
      log.info("DiscordREST", "addBadRoute", route),
      badRoutesRef.update(s => s.add(route)),
      store.incrementCounter(
        "dfx.rest.invalid",
        Duration.minutes(10).millis,
        10000,
      ),
    ])
  const isBadRoute = (route: string) => badRoutesRef.get.map(s => s.has(route))
  const removeBadRoute = (route: string) =>
    badRoutesRef.update(s => s.remove(route))

  const invalidRateLimit = (route: string) =>
    isBadRoute(route).tap(invalid =>
      invalid
        ? maybeWait("dfx.rest.invalid", Duration.minutes(10), 10000)
        : Effect.unit(),
    ).asUnit

  // Request rate limiting
  const requestRateLimit = (path: string, request: Http.Request) =>
    Do($ => {
      const route = routeFromConfig(path, request.method)
      const maybeBucket = $(store.getBucketForRoute(route))
      const bucket = maybeBucket.getOrElse(
        (): BucketDetails => ({
          key: `?.${route}`,
          resetAfter: 1000,
          limit: 5,
        }),
      )
      const resetAfter = millis(bucket.resetAfter)

      $(invalidRateLimit(route))
      $(maybeWait(`dfx.rest.${bucket.key}`, resetAfter, bucket.limit))
    })

  // Update rate limit buckets
  const updateBuckets = (request: Http.Request, response: Http.Response) =>
    Do($ => {
      const route = routeFromConfig(request.url, request.method)
      const { bucket, retryAfter, limit, remaining } = $(
        rateLimitFromHeaders(response.headers),
      )

      const effectsToRun = [
        removeBadRoute(route),
        store.putBucketRoute(route, bucket),
      ]

      const hasBucket = $(store.hasBucket(bucket))
      if (!hasBucket || limit - 1 === remaining) {
        effectsToRun.push(
          store.removeCounter(`dfx.rest.?.${route}`),
          store.putBucket({
            key: bucket,
            resetAfter: retryAfter.millis,
            limit: !hasBucket && remaining > 0 ? remaining : limit,
          }),
        )
      }

      $(Effect.allParDiscard(effectsToRun))
    }).ignore

  const httpExecutor = http.execute.filterStatusOk
    .contramap(_ =>
      _.updateUrl(_ => `${rest.baseUrl}${_}`).setHeaders({
        Authorization: `Bot ${token.value}`,
        "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${Pkg.version})`,
      }),
    )
    .catchAll(_ => Effect.fail(new DiscordRESTError(_)))

  const executor = <A = unknown>(
    request: Http.Request,
  ): Effect<never, DiscordRESTError, ResponseWithData<A>> =>
    Do($ => {
      $(requestRateLimit(request.url, request))
      $(globalRateLimit)

      const response = $(httpExecutor(request))

      $(updateBuckets(request, response))

      return response as ResponseWithData<A>
    }).catchTag("DiscordRESTError", e => {
      if (e.error._tag !== "StatusCodeError") {
        return Effect.fail(e)
      }

      const response = e.error.response

      switch (e.error.status) {
        case 403:
          return Do($ => {
            $(
              Effect.allParDiscard([
                log.info("DiscordREST", "403", request.url),
                addBadRoute(routeFromConfig(request.url, request.method)),
                updateBuckets(request, response),
              ]),
            )
            return $(Effect.fail(e))
          })

        case 429:
          return Do($ => {
            $(
              Effect.allParDiscard([
                log.info("DiscordREST", "429", request.url),
                addBadRoute(routeFromConfig(request.url, request.method)),
                updateBuckets(request, response),
                Effect.sleep(
                  retryAfter(response.headers).getOrElse(() =>
                    Duration.seconds(5),
                  ),
                ),
              ]),
            )
            return $(executor<A>(request))
          })
      }

      return Effect.fail(e)
    })

  const routes = Discord.createRoutes<Partial<Http.MakeOptions>>(
    <R, P>({
      method,
      url,
      params,
      options = {},
    }: Discord.Route<P, Partial<Http.MakeOptions>>): RestResponse<R> => {
      const hasBody = method !== "GET" && method !== "DELETE"
      let request = Http.make(method as any)(url, options)

      if (!hasBody) {
        if (params) {
          request = request.appendParams(params as any)
        }
      } else if (
        params &&
        request.body._tag === "Some" &&
        request.body.value._tag === "FormDataBody"
      ) {
        request.body.value.value.append("payload_json", JSON.stringify(params))
      } else if (params) {
        request = request.jsonBody(params)
      }

      return executor(request)
    },
  )

  return {
    ...routes,
    executor,
  }
})

export interface DiscordREST
  extends Discord.Endpoints<Partial<Http.MakeOptions>> {
  readonly executor: <A = unknown>(
    request: Http.Request,
  ) => Effect<never, DiscordRESTError, ResponseWithData<A>>
}

export const DiscordREST = Tag<DiscordREST>()
export const LiveDiscordREST =
  LiveRateLimiter >> Layer.effect(DiscordREST, make)
