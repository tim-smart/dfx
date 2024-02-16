import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import { millis } from "effect/Duration"
import { pipe } from "effect/Function"
import * as HashSet from "effect/HashSet"
import * as Option from "effect/Option"
import * as Secret from "effect/Secret"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import * as Http from "@effect/platform/HttpClient"
import { DiscordConfig } from "dfx/DiscordConfig"
import type { ResponseWithData, RestResponse } from "dfx/DiscordREST/types"
import {
  rateLimitFromHeaders,
  retryAfter,
  routeFromConfig,
} from "dfx/DiscordREST/utils"
import { RateLimiterLive, RateLimiter, RateLimitStore } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import { LIB_VERSION } from "dfx/version"
import type { Scope } from "effect/Scope"
import * as Effectable from "effect/Effectable"

export class DiscordRESTError {
  readonly _tag = "DiscordRESTError"
  constructor(
    readonly error: Http.error.HttpClientError,
    readonly body?: unknown,
  ) {}
}

const make = Effect.gen(function* (_) {
  const { rest, token } = yield* _(DiscordConfig)

  const http = yield* _(Http.client.Client)
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
          : Effect.unit,
      ),
      Effect.asUnit,
    )

  // Request rate limiting
  const requestRateLimit = (
    path: string,
    request: Http.request.ClientRequest,
  ) =>
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
        }),
      ),
    )

  // Update rate limit buckets
  const updateBuckets = (
    request: Http.request.ClientRequest,
    response: Http.response.ClientResponse,
  ) =>
    Effect.Do.pipe(
      Effect.let("route", () => routeFromConfig(request.url, request.method)),
      Effect.bind("rateLimit", () => rateLimitFromHeaders(response.headers)),
      Effect.bind("hasBucket", ({ rateLimit }) =>
        store.hasBucket(rateLimit.bucket),
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
              limit:
                !hasBucket && rateLimit.remaining > 0
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
    Http.client.filterStatusOk(http),
    Http.client.mapRequest(req =>
      pipe(
        Http.request.prependUrl(req, rest.baseUrl),
        Http.request.setHeaders({
          Authorization: `Bot ${Secret.value(token)}`,
          "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${LIB_VERSION})`,
        }),
      ),
    ),
    Http.client.catchAll(error =>
      error.reason === "StatusCode"
        ? error.response.json.pipe(
            Effect.mapError(_ => new DiscordRESTError(_)),
            Effect.flatMap(body =>
              Effect.fail(new DiscordRESTError(error, body)),
            ),
          )
        : Effect.fail(new DiscordRESTError(error)),
    ),
  )

  const executor = <A = unknown>(
    request: Http.request.ClientRequest,
  ): Effect.Effect<ResponseWithData<A>, DiscordRESTError, Scope> =>
    requestRateLimit(request.url, request).pipe(
      Effect.zipLeft(globalRateLimit),
      Effect.zipRight(
        httpExecutor(request) as Effect.Effect<
          ResponseWithData<A>,
          DiscordRESTError,
          Scope
        >,
      ),
      Effect.tap(response => updateBuckets(request, response)),
      Effect.catchTag("DiscordRESTError", e => {
        if (e.error.reason !== "StatusCode") {
          return Effect.fail(e)
        }

        const response = e.error.response

        switch (response.status) {
          case 403:
            return Effect.zipRight(
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
              Effect.fail(e),
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
              Effect.zipRight(executor<A>(request)),
            )
        }

        return Effect.fail(e)
      }),
      Effect.annotateLogs({
        package: "dfx",
        module: "DiscordREST",
      }),
    )

  const routes = Discord.createRoutes<Partial<Http.request.Options.NoUrl>>(
    <R, P>({
      method,
      options = {},
      params,
      url,
    }: Discord.Route<
      P,
      Partial<Http.request.Options.NoUrl>
    >): RestResponse<R> => {
      const hasBody = method !== "GET" && method !== "DELETE"
      let request = Http.request.make(method as any)(url, options)

      if (!hasBody) {
        if (params) {
          request = Http.request.appendUrlParams(request, params as any)
        }
      } else if (params && request.body._tag === "FormData") {
        request.body.formData.append("payload_json", JSON.stringify(params))
      } else if (params) {
        request = Http.request.unsafeJsonBody(request, params)
      }

      return new RestResponseImpl(executor(request))
    },
  )

  return {
    ...routes,
    executor,
  }
})

class RestResponseImpl<T>
  extends Effectable.Class<ResponseWithData<T>, DiscordRESTError>
  implements RestResponse<T>
{
  constructor(
    readonly response: Effect.Effect<
      ResponseWithData<T>,
      DiscordRESTError,
      Scope
    >,
  ) {
    super()
  }

  commit(): Effect.Effect<ResponseWithData<T>, DiscordRESTError> {
    return Effect.scoped(this.response)
  }

  get json() {
    return Effect.scoped(Effect.flatMap(this.response, _ => _.json))
  }

  get response() {
    return this.response
  }
}

export interface DiscordREST {
  readonly _: unique symbol
}

export interface DiscordRESTService
  extends Discord.Endpoints<Partial<Http.request.Options.NoUrl>> {
  readonly executor: <A = unknown>(
    request: Http.request.ClientRequest,
  ) => Effect.Effect<ResponseWithData<A>, DiscordRESTError, Scope>
}

export const DiscordREST = GenericTag<DiscordREST, DiscordRESTService>(
  "dfx/DiscordREST",
)
export const DiscordRESTLive = Layer.effect(DiscordREST, make).pipe(
  Layer.provide(RateLimiterLive),
  Layer.provide(Http.client.layer),
)
