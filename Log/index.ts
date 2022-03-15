import * as L from "@effect-ts/core/Effect/Layer"
import * as T from "@effect-ts/core/Effect"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"

const make = (debug = false) =>
  ({
    _tag: "LogService",
    log: (...args: any[]) =>
      T.succeedWith(() => {
        console.error("INFO", ...args)
      }),
    debug: (...args: any[]) =>
      debug
        ? T.succeedWith(() => {
            console.error("DEBUG", ...args)
          })
        : T.unit,
  } as const)

export interface Log extends ReturnType<typeof make> {}
export const Log = tag<Log>()
export const LiveLog = L.fromValue(Log)(make(false))
export const LiveLogDebug = L.fromValue(Log)(make(true))

export const log = (...args: any[]) =>
  T.accessServiceM(Log)(({ log }) => log(...args))

export const logDebug = (...args: any[]) =>
  T.accessServiceM(Log)(({ debug }) => debug(...args))
