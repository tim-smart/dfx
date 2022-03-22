import * as T from "@effect-ts/core/Effect"
import { Has, tag } from "@effect-ts/system/Has"
import Axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import * as Config from "../DiscordConfig"
import { createRoutes, Endpoints } from "../types"
import * as Http from "./http"
import { Response, RESTError } from "./types"

interface AxiosEndpoints extends Endpoints<AxiosRequestConfig> {}
export interface DiscordREST extends AxiosEndpoints {
  _tag: "DiscordREST"
  axios: AxiosInstance
}
export const DiscordREST = tag<DiscordREST>()

interface FormData {
  append: (key: string, value: unknown) => void
  getHeaders: () => Record<string, string>
}

const make = T.gen(function* (_) {
  const token = yield* _(Config.token)
  const config = yield* _(Config.rest)

  const axios = Axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bot ${token}`,
    },
  })
  const request = Http.request(axios)
  const routes = createRoutes<AxiosRequestConfig>(
    ({ method, url, params = {}, options = {} }) => {
      const hasBody = method !== "GET" && method !== "DELETE"
      let hasFormData = false

      if (typeof options.data?.append === "function") {
        hasFormData = true
        ;(options.data as FormData).append(
          "payload_json",
          JSON.stringify(params),
        )
      }

      const qsParams = hasBody
        ? options.params
        : {
            ...(options.params || {}),
            ...params,
          }
      const data =
        hasFormData || !hasBody
          ? options.data
          : {
              ...(options.data || {}),
              ...params,
            }

      const config = {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(hasFormData ? data.getHeaders() : {}),
        },
        method: method as Method,
        url,
        params: qsParams,
        data,
      }
      return request(config)
    },
  )

  const rest: DiscordREST = {
    _tag: "DiscordREST",
    axios,
    ...routes,
  }

  return rest
})

export const LiveDiscordREST = T.toLayer(DiscordREST)(make)

export const rest = T.accessServiceM(DiscordREST)

type InferResponse<T extends (...args: any[]) => Response<any>> = T extends (
  ...args: any[]
) => Response<infer R>
  ? R
  : never

export const call = <K extends keyof AxiosEndpoints>(
  method: K,
  ...args: Parameters<AxiosEndpoints[K]>
): T.Effect<Has<DiscordREST>, RESTError, InferResponse<AxiosEndpoints[K]>> =>
  rest((r) => (r[method] as any)(...args))
