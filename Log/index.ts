import * as T from "@effect-ts/core/Effect"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"

const service = {
  _tag: "LogService",
  log: (...args: any[]) =>
    T.succeedWith(() => {
      console.error(...args)
    }),
} as const

type Service = typeof service

export interface Log extends Service {}
export const Log = tag<Log>()
export const LiveLog = T.toLayer(Log)(T.succeed(service))

export const log = (...args: any[]) =>
  T.accessServiceM(Log)(({ log }) => log(...args))
