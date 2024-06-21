import type * as HttpError from "@effect/platform/HttpClientError"
import type * as HttpResponse from "@effect/platform/HttpClientResponse"
import type { DiscordRESTError } from "dfx/DiscordREST"
import type * as Effect from "effect/Effect"
import type { Scope } from "effect/Scope"

export interface ResponseWithData<A> extends HttpResponse.HttpClientResponse {
  readonly json: Effect.Effect<A, HttpError.ResponseError>
}

export interface RestResponse<T>
  extends Effect.Effect<ResponseWithData<T>, DiscordRESTError> {
  readonly json: Effect.Effect<T, DiscordRESTError | HttpError.ResponseError>
  readonly effect: Effect.Effect<ResponseWithData<T>, DiscordRESTError, Scope>
}
