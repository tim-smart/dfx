import * as T from "@effect-ts/core/Effect"
import * as Axios from "axios"
import { RESTError, Response } from "./types"

export const request =
  (axios: Axios.AxiosInstance) =>
  <A>(config: Axios.AxiosRequestConfig): Response<A> =>
    T.tryCatchPromise<RESTError, A>(
      () => axios.request<A>(config).then((r) => r.data),
      (err) => ({
        _tag: "http",
        code: (err as Axios.AxiosError).response!.status,
        body: (err as Axios.AxiosError).response?.data,
      }),
    )
