export interface ResponseWithData<A> {
  response: Response
  json: Effect<never, JsonParseError, A>
  text: Effect<never, never, string>
  blob: Effect<never, BlobError, Blob>
}

export type RestResponse<T> = Effect<
  never,
  FetchError | StatusCodeError | JsonParseError,
  ResponseWithData<T>
>
