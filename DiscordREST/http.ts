import * as T from "@effect-ts/core/Effect"
import * as Axios from "axios"
import { RESTError, Response } from "./types"

export const request =
  (axios: Axios.AxiosInstance) =>
  <A>(config: Axios.AxiosRequestConfig): Response<A> =>
    T.tryCatchPromise<RESTError, A>(
      () => axios.request<A>(config).then((r) => r.data),
      (err) => {
        const axiosErr = err as Axios.AxiosError<A>
        return axiosErr.response
          ? {
              _tag: "http",
              config: axiosErr.config,
              code: axiosErr.response.status,
              body: axiosErr.response.data,
            }
          : { _tag: "axios", cause: axiosErr as Axios.AxiosError<never> }
      },
    )
