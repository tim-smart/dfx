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

export const text = (r: Response) => Effect.promise(() => r.text())

export const jsonOrText = (r: Response) =>
  r.headers.get("content-type")?.includes("application/json")
    ? json(r)
    : text(r)

export const requestWithJson = <A = unknown>(
  url: URL | string,
  init: RequestInit = {},
) =>
  request(url, init).flatMap((response) =>
    jsonOrText(response).map((data) => ({
      response,
      data: data as A,
    })),
  )
