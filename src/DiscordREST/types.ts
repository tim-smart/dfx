import * as Http from "@effect-http/client"
import { DiscordRESTError } from "dfx/DiscordREST"
import { Effect } from "dfx/_common"

export interface ResponseWithData<A> extends Http.response.Response {
  readonly json: Effect<never, Http.ResponseDecodeError, A>
}

export type RestResponse<T> = Effect<
  never,
  DiscordRESTError,
  ResponseWithData<T>
>
