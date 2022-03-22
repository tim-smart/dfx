import * as T from "@effect-ts/core/Effect"
import { Has } from "@effect-ts/core/Has"
import { AxiosError, AxiosRequestConfig } from "axios"
import { DiscordREST } from "."

export type RESTError =
  | {
      _tag: "http"
      config: AxiosRequestConfig<unknown>
      code: number
      body?: unknown
    }
  | { _tag: "axios"; cause: AxiosError<never> }

export type Response<T> = T.Effect<Has<DiscordREST>, RESTError, T>
