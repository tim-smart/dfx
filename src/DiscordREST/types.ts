import { DiscordREST } from "./index.js"

export interface ResponseWithData<A> {
  response: Response
  json: Effect<never, Http.JsonParseError, A>
  text: Effect<never, never, string>
  blob: Effect<never, Http.BlobError, Blob>
}

export type RestResponse<T> = Effect<
  DiscordREST,
  Http.FetchError | Http.StatusCodeError | Http.JsonParseError,
  ResponseWithData<T>
>
