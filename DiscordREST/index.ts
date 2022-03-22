import * as T from "@effect-ts/core/Effect"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"
import Axios, { AxiosRequestConfig, Method } from "axios"
import * as Config from "../DiscordConfig"
import { createRoutes } from "../types"
import * as Http from "./http"

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

  return {
    _tag: "DiscordREST",
    axios,
    request,
  }
})

export interface DiscordREST extends _A<typeof make> {}
export const DiscordREST = tag<DiscordREST>()
export const LiveDiscordREST = T.toLayer(DiscordREST)(make)

export const rest = createRoutes<AxiosRequestConfig>(
  ({ method, url, params = {}, options = {} }) =>
    T.accessServiceM(DiscordREST)(({ request }) => {
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
    }),
)
