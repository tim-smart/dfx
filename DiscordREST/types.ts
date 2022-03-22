import * as T from "@effect-ts/core/Effect"
import { AxiosError, AxiosRequestConfig } from "axios"

export type RESTError =
  | {
      _tag: "http"
      config: AxiosRequestConfig<unknown>
      code: number
      body?: unknown
    }
  | { _tag: "axios"; cause: AxiosError<never> }

export type Response<T> = T.IO<RESTError, T>
