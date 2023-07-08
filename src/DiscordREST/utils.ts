import * as Option from "@effect/data/Option"

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

export const numberHeader = (headers: Headers) => (key: string) =>
  Maybe.fromNullable(headers.get(key))
    .map(parseFloat)
    .filter(n => !isNaN(n))

export const retryAfter = (headers: Headers) =>
  numberHeader(headers)("x-ratelimit-reset-after")
    .orElse(() => numberHeader(headers)("retry-after"))
    .map(Duration.seconds)

export const rateLimitFromHeaders = (headers: Headers) =>
  Option.all({
    bucket: Maybe.fromNullable(headers.get("x-ratelimit-bucket")),
    retryAfter: retryAfter(headers),
    limit: numberHeader(headers)("x-ratelimit-limit"),
    remaining: numberHeader(headers)("x-ratelimit-remaining"),
  })
export type RateLimitDetails = ReturnType<typeof rateLimitFromHeaders>
