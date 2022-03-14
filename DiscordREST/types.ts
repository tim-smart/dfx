import * as T from "@effect-ts/core/Effect"

export type RESTError = { _tag: "http"; code: number; body?: unknown }

export type Response<T> = T.IO<RESTError, T>
