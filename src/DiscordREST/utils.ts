import { Duration, Option } from "dfx/_common"

const majorResources = ["channels", "guilds", "webhooks"] as const

export const routeFromConfig = (path: string, init: RequestInit) => {
  const method = (init?.method ?? "get").toLowerCase()

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

export const numberHeader = (headers: Headers) => (key: string) =>
  Option.fromNullable(headers.get(key))
    .map(parseFloat)
    .filter((n) => !isNaN(n))

export const retryAfter = (headers: Headers) =>
  numberHeader(headers)("x-ratelimit-reset-after")
    .catchAll(() => numberHeader(headers)("retry-after"))
    .map(Duration.seconds)

export const rateLimitFromHeaders = (headers: Headers) =>
  Option.struct({
    bucket: Option.fromNullable(headers.get("x-ratelimit-bucket")),
    retryAfter: retryAfter(headers),
    limit: numberHeader(headers)("x-ratelimit-limit"),
    remaining: numberHeader(headers)("x-ratelimit-remaining"),
  })
export type RateLimitDetails = ReturnType<typeof rateLimitFromHeaders>
