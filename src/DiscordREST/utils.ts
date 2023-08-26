import * as Duration from "@effect/data/Duration"
import * as Option from "@effect/data/Option"
import * as ReadonlyRecord from "@effect/data/ReadonlyRecord"
import type * as Http from "@effect/platform/HttpClient"

const majorResources = ["channels", "guilds", "webhooks"] as const

export const routeFromConfig = (path: string, method: string) => {
  // Only keep major ID's
  const routeURL = path
    .split("?")[0]
    .replace(
      /\/([A-Za-z]+)\/(\d{16,21}|@me)/g,
      (match, resource) =>
        majorResources.includes(resource) ? match : `/${resource}`,
    )
    // Strip reactions
    .replace(/\/reactions\/(.*)/, "/reactions")

  return `${method}-${routeURL}`
}

export const numberHeader = (headers: Http.headers.Headers) => (key: string) =>
  ReadonlyRecord.get(headers, key).pipe(
    Option.map(parseFloat),
    Option.filter(n => !isNaN(n)),
  )

export const retryAfter = (headers: Http.headers.Headers) =>
  numberHeader(headers)("x-ratelimit-reset-after").pipe(
    Option.orElse(() => numberHeader(headers)("retry-after")),
    Option.map(Duration.seconds),
  )

export const rateLimitFromHeaders = (headers: Http.headers.Headers) =>
  Option.all({
    bucket: ReadonlyRecord.get(headers, "x-ratelimit-bucket"),
    retryAfter: retryAfter(headers),
    limit: numberHeader(headers)("x-ratelimit-limit"),
    remaining: numberHeader(headers)("x-ratelimit-remaining"),
  })
export type RateLimitDetails = ReturnType<typeof rateLimitFromHeaders>
