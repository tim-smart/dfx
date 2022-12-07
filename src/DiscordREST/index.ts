import { millis } from "@fp-ts/data/Duration"
import { BucketDetails } from "dfx/RateLimitStore/index"
import { ResponseWithData } from "./types.js"
import { rateLimitFromHeaders, routeFromConfig, retryAfter } from "./utils.js"
import Pkg from "../package.json" assert { type: "json" }

const make = Do(($) => {
  const { token, rest } = $(Effect.service(Config.DiscordConfig))

  const log = $(Effect.service(Log.Log))
  const store = $(Effect.service(RateLimitStore.RateLimitStore))
  const { maybeWait } = $(Effect.service(RateLimitStore.RateLimiter))

  const globalRateLimit = maybeWait(
    "rest.global",
    rest.globalRateLimit.window,
    rest.globalRateLimit.limit,
  )

  // Invalid route handling (40x)
  const badRoutesRef = $(Ref.make(HashSet.empty<string>()))
  const addBadRoute = (route: string) =>
    [
      log.info("DiscordREST", "addBadRoute", route),
      badRoutesRef.update((s) => s.add(route)),
      store.incrementCounter(
        "rest.invalid",
        Duration.minutes(10).millis,
        10000,
      ),
    ].collectAllParDiscard
  const isBadRoute = (route: string) =>
    badRoutesRef.get.map((s) => s.has(route))
  const removeBadRoute = (route: string) =>
    badRoutesRef.update((s) => s.remove(route))

  const invalidRateLimit = (route: string) =>
    isBadRoute(route).tap((invalid) =>
      invalid
        ? maybeWait("rest.invalid", Duration.minutes(10), 10000)
        : Effect.unit(),
    ).asUnit

  // Request rate limiting
  const requestRateLimit = (path: string, init: RequestInit) =>
    Do(($) => {
      const route = routeFromConfig(path, init)
      const maybeBucket = $(store.getBucketForRoute(route))
      const bucket = maybeBucket.getOrElse(
        (): BucketDetails => ({
          key: `?.${route}`,
          resetAfter: 5000,
          limit: 1,
        }),
      )
      const resetAfter = millis(bucket.resetAfter)

      $(invalidRateLimit(route))
      $(maybeWait(`rest.bucket.${bucket.key}`, resetAfter, bucket.limit))
    })

  // Update rate limit buckets
  const updateBuckets = (path: string, init: RequestInit, response: Response) =>
    Do(($) => {
      const route = routeFromConfig(path, init)
      const { bucket, retryAfter, limit, remaining } = $(
        Effect.fromOption(rateLimitFromHeaders(response.headers)),
      )

      const effectsToRun = [
        removeBadRoute(route),
        store.putBucketRoute(route, bucket),
      ]

      const hasBucket = $(store.hasBucket(bucket))
      if (!hasBucket || limit - 1 === remaining) {
        effectsToRun.push(
          store.putBucket({
            key: bucket,
            resetAfter: retryAfter.millis,
            limit: !hasBucket && remaining > 0 ? remaining : limit,
          }),
        )
      }

      $(effectsToRun.collectAllParDiscard)
    }).ignore

  const request = <A = unknown>(
    path: string,
    init: RequestInit = {},
  ): Effect<
    never,
    Http.FetchError | Http.StatusCodeError | Http.JsonParseError,
    ResponseWithData<A>
  > =>
    Do(($) => {
      $(requestRateLimit(path, init))
      $(globalRateLimit)

      const response = $(
        Http.requestWithJson<A>(`${rest.baseUrl}${path}`, {
          ...init,
          headers: {
            ...(init?.headers ?? {}),
            Authorization: `Bot ${token}`,
            "User-Agent": `DiscordBot (https://github.com/tim-smart/dfx, ${Pkg.version})`,
          },
        }),
      )

      $(updateBuckets(path, init, response.response))

      return response
    }).catchTag("StatusCodeError", (e) => {
      switch (e.code) {
        case 403:
          return Do(($) => {
            $(
              [
                log.info("DiscordREST", "403", path),
                addBadRoute(routeFromConfig(path, init)),
                updateBuckets(path, init, e.response),
              ].collectAllParDiscard,
            )
            return $(Effect.fail(e))
          })

        case 429:
          return Do(($) => {
            $(
              [
                log.info("DiscordREST", "429", path),
                addBadRoute(routeFromConfig(path, init)),
                updateBuckets(path, init, e.response),
                Effect.sleep(
                  retryAfter(e.response.headers).getOrElse(() =>
                    Duration.seconds(5),
                  ),
                ),
              ].collectAllParDiscard,
            )
            return $(request<A>(path, init))
          })
      }

      return Effect.fail(e)
    })

  return { request }
})

export interface DiscordREST extends Success<typeof make> {}
export const DiscordREST = Tag<DiscordREST>()
export const LiveDiscordREST = Layer.fromEffect(DiscordREST)(make)

export const rest = Discord.createRoutes<RequestInit>(
  ({ method, url, params, options = {} }) =>
    Effect.serviceWithEffect(DiscordREST)(({ request }) => {
      const hasBody = method !== "GET" && method !== "DELETE"
      let hasFormData = typeof (options?.body as any)?.append === "function"
      let body: BodyInit | undefined = undefined

      const headers: Record<string, string> = {}
      if (hasBody && !hasFormData) {
        headers["content-type"] = "application/json"
      }

      const qs = new URLSearchParams()
      if (!hasBody) {
        Object.entries((params ?? {}) as Record<string, string>).forEach(
          ([key, value]) => {
            qs.append(key, value)
          },
        )
      } else if (hasFormData) {
        body = options.body!
        if (params) {
          ;(body as FormData).append("payload_json", JSON.stringify(params))
        }
      } else if (params) {
        body = JSON.stringify(params)
      } else {
        body = options.body!
      }

      return request(`${url}?${qs.toString()}`, {
        method,
        headers,
        body,
      })
    }),
)
