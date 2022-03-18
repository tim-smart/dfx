import * as T from "@effect-ts/core/Effect"
import * as Axios from "axios"

export const request =
  <A>(axios: Axios.AxiosInstance) =>
  (config: Axios.AxiosRequestConfig) =>
    T.tryCatchPromise(() => axios.request<A>(config), onReject)
