export class FetchError {
  readonly _tag = "FetchError"
  constructor(readonly reason: unknown) {}
}

export class StatusCodeError {
  readonly _tag = "StatusCodeError"
  get code() {
    return this.response.status
  }
  constructor(readonly response: Response) {}
}

export const request = (url: URL | string, init: RequestInit = {}) =>
  Effect.asyncInterrupt<never, FetchError, Response>((resume) => {
    const controller = new AbortController()
    fetch(url, {
      ...init,
      signal: controller.signal,
    })
      .then((a) => resume(Effect.succeed(a)))
      .catch((e) => resume(Effect.fail(new FetchError(e))))

    return Either.left(
      Effect.sync(() => {
        controller.abort()
      }),
    )
  }).filterOrElseWith(
    (r) => r.status < 300,
    (r) => Effect.fail(new StatusCodeError(r)),
  )

export class JsonParseError {
  readonly _tag = "JsonParseError"
  constructor(readonly reason: unknown) {}
}

export const json = (r: Response) =>
  Effect.tryCatchPromise(
    (): Promise<unknown> => r.json(),
    (reason) => new JsonParseError(reason),
  )

export const jsonOrResponse = (r: Response) =>
  r.headers.get("content-type")?.includes("application/json")
    ? json(r)
    : Effect.succeed(r)

export const requestWithJson = <A = unknown>(
  url: URL | string,
  init: RequestInit = {},
) =>
  request(url, init).flatMap((response) =>
    jsonOrResponse(response).map((data) => ({
      response,
      data: data as A,
    })),
  )
