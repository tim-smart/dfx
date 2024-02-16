import type * as Effect from "effect/Effect"
import type * as Http from "@effect/platform/HttpClient"
import type { DiscordRESTError } from "dfx/DiscordREST"
import type { Scope } from "effect/Scope"

export interface ResponseWithData<A> extends Http.response.ClientResponse {
  readonly json: Effect.Effect<A, Http.error.ResponseError>
}

export interface RestResponse<T>
  extends Effect.Effect<ResponseWithData<T>, DiscordRESTError, Scope> {
  readonly json: Effect.Effect<T, DiscordRESTError | Http.error.ResponseError>
  readonly asUnit: Effect.Effect<void, DiscordRESTError>
}
