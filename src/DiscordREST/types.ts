import type * as Effect from "effect/Effect"
import type * as Http from "@effect/platform/HttpClient"
import type { DiscordRESTError } from "dfx/DiscordREST"

export interface ResponseWithData<A> extends Http.response.ClientResponse {
  readonly json: Effect.Effect<A, Http.error.ResponseError>
}

export type RestResponse<T> = Effect.Effect<ResponseWithData<T>, DiscordRESTError>
