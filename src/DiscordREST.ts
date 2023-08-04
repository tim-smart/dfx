import * as Http from "@effect-http/client"
import { Tag } from "@effect/data/Context"
import * as Duration from "@effect/data/Duration"
import { millis } from "@effect/data/Duration"
import { pipe } from "@effect/data/Function"
import * as HashSet from "@effect/data/HashSet"
import * as Option from "@effect/data/Option"
import * as ConfigSecret from "@effect/io/Config/Secret"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import * as Ref from "@effect/io/Ref"
import { DiscordConfig } from "dfx/DiscordConfig"
import type { ResponseWithData, RestResponse } from "dfx/DiscordREST/types"
import {
  rateLimitFromHeaders,
  retryAfter,
  routeFromConfig,
} from "dfx/DiscordREST/utils"
import { Log } from "dfx/Log"
import { LiveRateLimiter, RateLimiter, RateLimitStore } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import { LIB_VERSION } from "dfx/version"

export class DiscordRESTError {
  readonly _tag = "DiscordRESTError"
  constructor(readonly error: Http.HttpClientError, readonly body?: unknown) {}
}

export { ResponseDecodeError } from "@effect-http/client"

const make = Effect.gen(function*(_) {
  const { rest, token } = yield* _(DiscordConfig)

  const http = yield* _(Http.HttpRequestExecutor)
  const log = yield* _(Log)
  const store = yield* _(RateLimitStore)
  const { maybeWait } = yield* _(RateLimiter)

  const globalRateLimit = maybeWait(
    "dfx.rest.global",
    Duration.decode(rest.globalRateLimit.window),
    rest.globalRateLimit.limit,
  )

  // Invalid route handling (40x)
  const badRoutesRef = yield* _(Ref.make(HashSet.empty<string>()))
  const tenMinutes = Duration.toMillis(Duration.minutes(10))
  const addBadRoute = (route: string) =>
    log
      .info("DiscordREST", "addBadRoute", route)
      .pipe(
        Effect.zipRight(Ref.update(badRoutesRef, HashSet.add(route))),
        Effect.zipRight(
          store.incrementCounter("dfx.rest.invalid", tenMinutes, 10000),
        ),
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
          : Effect.unit
      ),
      Effect.asUnit,
    )

  // Request rate limiting
  const requestRateLimit = (path: string, request: Http.Request) =>
    Effect.Do.pipe(
      Effect.let("route", () => routeFromConfig(path, request.method)),
      Effect.bind("maybeBucket", ({ route }) => store.getBucketForRoute(route)),
      Effect.flatMap(({ maybeBucket, route }) =>
        Option.match(maybeBucket, {
          onNone: () => invalidRateLimit(route),
          onSome: bucket =>
            Effect.zipRight(
              invalidRateLimit(route),
              maybeWait(
                `dfx.rest.${bucket.key}`,
                millis(bucket.resetAfter),
                bucket.limit,
              ),
            ),
        })
      ),
    )

  // Update rate limit buckets
  const updateBuckets = (request: Http.Request, response: Http.Response) =>
    Effect.Do.pipe(
      Effect.let("route", () => routeFromConfig(request.url, request.method)),
      Effect.bind("rateLimit", () => rateLimitFromHeaders(response.headers)),
      Effect.bind(
        "hasBucket",
        ({ rateLimit }) => store.hasBucket(rateLimit.bucket),
      ),
      Effect.flatMap(({ hasBucket, rateLimit, route }) => {
        const effectsToRun = [
          removeBadRoute(route),
          store.putBucketRoute(route, rateLimit.bucket),
        ]

        if (!hasBucket || rateLimit.limit - 1 === rateLimit.remaining) {
          effectsToRun.push(
            store.removeCounter(`dfx.rest.?.${route}`),
            store.putBucket({
              key: rateLimit.bucket,
              resetAfter: Duration.toMillis(rateLimit.retryAfter),
              limit: !hasBucket && rateLimit.remaining > 0
                ? rateLimit.remaining
                : rateLimit.limit,
            }),
          )
        }

        return Effect.all(effectsToRun, {
          concurrency: "unbounded",
          discard: true,
        })
      }),
      Effect.ignore,
    )

  const httpExecutor = pipe(
    http.execute,
    Http.executor.filterStatusOk,
    Http.executor.contramap(req =>
      pipe(
        Http.updateUrl(req, _ => `${rest.baseUrl}${_}`),
        Http.setHeaders({
          Authorization: `Bot ${ConfigSecret.value(token)}`,
          "User-Agent":
            `DiscordBot (https://github.com/tim-smart/dfx, ${LIB_VERSION})`,
        }),
      )
    ),
    Http.executor.catchAll(error =>
      error._tag === "StatusCodeError"
        ? error.response.json.pipe(
          Effect.mapError(_ => new DiscordRESTError(_)),
          Effect.flatMap(body =>
            Effect.fail(new DiscordRESTError(error, body))
          ),
        )
        : Effect.fail(new DiscordRESTError(error))
    ),
  )

  const executor = <A = unknown>(
    request: Http.Request,
  ): Effect.Effect<never, DiscordRESTError, ResponseWithData<A>> =>
    requestRateLimit(request.url, request).pipe(
      Effect.zipLeft(globalRateLimit),
      Effect.zipRight(
        httpExecutor(request) as Effect.Effect<
          never,
          DiscordRESTError,
          ResponseWithData<A>
        >,
      ),
      Effect.tap(response => updateBuckets(request, response)),
      Effect.catchTag("DiscordRESTError", e => {
        if (e.error._tag !== "StatusCodeError") {
          return Effect.fail(e)
        }

        const response = e.error.response

        switch (e.error.status) {
          case 403:
            return Effect.zipRight(
              Effect.all(
                [
                  log.info("DiscordREST", "403", request.url),
                  addBadRoute(routeFromConfig(request.url, request.method)),
                  updateBuckets(request, response),
                ],
                { concurrency: "unbounded", discard: true },
              ),
              Effect.fail(e),
            )

          case 429:
            return log
              .info("DiscordREST", "429", request.url)
              .pipe(
                Effect.zipRight(
                  addBadRoute(routeFromConfig(request.url, request.method)),
                ),
                Effect.zipRight(updateBuckets(request, response)),
                Effect.zipRight(
                  Effect.sleep(
                    Option.getOrElse(
                      retryAfter(response.headers),
                      () => Duration.seconds(5),
                    ),
                  ),
                ),
                Effect.zipRight(executor<A>(request)),
              )
        }

        return Effect.fail(e)
      }),
    )

  const routes = Discord.createRoutes<Partial<Http.MakeOptions>>(
    <R, P>({
      method,
      options = {},
      params,
      url,
    }: Discord.Route<P, Partial<Http.MakeOptions>>): RestResponse<R> => {
      const hasBody = method !== "GET" && method !== "DELETE"
      let request = Http.make(method as any)(url, options)

      if (!hasBody) {
        if (params) {
          request = Http.appendParams(request, params as any)
        }
      } else if (
        params
        && request.body._tag === "Some"
        && request.body.value._tag === "FormDataBody"
      ) {
        request.body.value.value.append("payload_json", JSON.stringify(params))
      } else if (params) {
        request = Http.jsonBody(request, params)
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
  extends Discord.Endpoints<Partial<Http.MakeOptions>>
{
  readonly executor: <A = unknown>(
    request: Http.Request,
  ) => Effect.Effect<never, DiscordRESTError, ResponseWithData<A>>
}

export const DiscordREST = Tag<DiscordREST>()
export const LiveDiscordREST = Layer.provide(
  LiveRateLimiter,
  Layer.effect(DiscordREST, make),
)
