import type * as Http from "@effect-http/client"
import type * as Effect from "@effect/io/Effect"
import type { DiscordRESTError } from "dfx/DiscordREST"

export interface ResponseWithData<A> extends Http.response.Response {
  readonly json: Effect.Effect<never, Http.ResponseDecodeError, A>
}

export type RestResponse<T> = Effect.Effect<
  never,
  DiscordRESTError,
  ResponseWithData<T>
>
