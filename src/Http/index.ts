export class FetchError {
  readonly _tag = "FetchError"
  constructor(readonly reason: unknown) {}
}

export class StatusCodeError {
  readonly _tag = "StatusCodeError"
  readonly code: number
  constructor(readonly response: Response) {
    this.code = response.status
  }
}

export const request = (url: URL | string, init: RequestInit = {}) =>
  Effect.tryCatchAbort(
    (signal) =>
      fetch(url, {
        ...init,
        signal,
      }),
    (e) => new FetchError(e),
  ).filterOrElseWith(
    (r) => r.status < 300,
    (r) => Effect.fail(new StatusCodeError(r)),
  )

export class JsonParseError {
  readonly _tag = "JsonParseError"
  constructor(readonly reason: unknown) {}
}

export const json = <A = unknown>(r: Response) =>
  Effect.tryCatchPromise(
    (): Promise<A> => r.json(),
    (reason) => new JsonParseError(reason),
  )

export class BlobError {
  readonly _tag = "BlobError"
  constructor(readonly reason: unknown) {}
}

export const blob = (r: Response) =>
  Effect.tryCatchPromise(
    () => r.blob(),
    (reason) => new BlobError(reason),
  )

export const requestWithJson = <A = unknown>(
  url: URL | string,
  init: RequestInit = {},
) =>
  request(url, init).map((response) => ({
    response,
    json: json<A>(response),
    blob: blob(response),
    text: Effect.promise(() => response.text()),
  }))
