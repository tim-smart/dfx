import { BlobError, FetchError, JsonParseError, StatusCodeError } from "dfx"
import { Effect } from "dfx/_common"

export interface ResponseWithData<A> {
  response: Response
  json: Effect.Effect<never, JsonParseError, A>
  text: Effect.Effect<never, never, string>
  blob: Effect.Effect<never, BlobError, Blob>
}

export type RestResponse<T> = Effect.Effect<
  never,
  FetchError | StatusCodeError | JsonParseError,
  ResponseWithData<T>
>
