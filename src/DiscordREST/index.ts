import { millis } from "@fp-ts/data/Duration"
import { BucketDetails } from "dfx/RateLimitStore/index"
import { ResponseWithData } from "./types.js"
import { rateLimitFromHeaders, routeFromConfig } from "./utils.js"

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

  const requestRateLimit = (path: string, init: RequestInit) =>
    Do(($) => {
      const route = routeFromConfig(path, init)
      const maybeBucket = $(store.getBucketForRoute(route))
      const bucket = maybeBucket.getOrElse(
        (): BucketDetails => ({
          key: `?.${Equal.hash(route)}`,
          resetAfter: 5000,
          limit: 1,
        }),
      )
      const resetAfter = millis(bucket.resetAfter)
      $(maybeWait(`rest.bucket.${bucket.key}`, resetAfter, bucket.limit))
    })

  const updateBuckets = (path: string, init: RequestInit, response: Response) =>
    Do(($) => {
      const route = routeFromConfig(path, init)
      const { bucket, retryAfter, limit, remaining } = $(
        Effect.fromOption(rateLimitFromHeaders(response.headers)),
      )

      const effectsToRun = [store.putBucketRoute(route, bucket)]

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
    requestRateLimit(path, init)
      .tap(() => globalRateLimit)
      .flatMap(() =>
        Http.requestWithJson<A>(`${rest.baseUrl}${path}`, {
          ...init,
          headers: {
            ...(init?.headers ?? {}),
            Authorization: `Bot ${token}`,
          },
        }),
      )
      .catchTag("StatusCodeError", (e) =>
        e.code === 429
          ? Do(($) => {
              $(log.debug("DiscordREST", "429", path))
              $(updateBuckets(path, init, e.response))
              return $(request<A>(path, init))
            })
          : Effect.fail(e),
      )
      .tap(({ response }) => updateBuckets(path, init, response))

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
