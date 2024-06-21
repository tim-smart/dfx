import * as Duration from "effect/Duration"
import * as Option from "effect/Option"
import * as Headers from "@effect/platform/Headers"

const majorResources = ["channels", "guilds", "webhooks"] as const

export const routeFromConfig = (path: string, method: string) => {
  // Only keep major ID's
  const routeURL = path
    .split("?")[0]
    .replace(/\/([A-Za-z]+)\/(\d{16,21}|@me)/g, (match, resource) =>
      majorResources.includes(resource) ? match : `/${resource}`,
    )
    // Strip reactions
    .replace(/\/reactions\/(.*)/, "/reactions")

  return `${method}-${routeURL}`
}

export const numberHeader = (headers: Headers.Headers) => (key: string) =>
  Headers.get(headers, key).pipe(
    Option.map(parseFloat),
    Option.filter(n => !isNaN(n)),
  )

export const retryAfter = (headers: Headers.Headers) =>
  numberHeader(headers)("x-ratelimit-reset-after").pipe(
    Option.orElse(() => numberHeader(headers)("retry-after")),
    Option.map(Duration.seconds),
  )

export const rateLimitFromHeaders = (headers: Headers.Headers) =>
  Option.all({
    bucket: Headers.get(headers, "x-ratelimit-bucket"),
    retryAfter: retryAfter(headers),
    limit: numberHeader(headers)("x-ratelimit-limit"),
    remaining: numberHeader(headers)("x-ratelimit-remaining"),
  })
export type RateLimitDetails = ReturnType<typeof rateLimitFromHeaders>
