import { DiscordREST } from "./index.js"

export interface ResponseWithData<A> {
  response: Response
  data: A
}

export type RestResponse<T> = Effect<
  DiscordREST,
  Http.FetchError | Http.StatusCodeError | Http.JsonParseError,
  ResponseWithData<T>
>
