import { Tag } from "@effect/data/Context"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"

const make = (debug = false) => ({
  info: (...args: Array<any>) =>
    Effect.sync(() => {
      console.error("INFO", ...args)
    }),
  debug: (...args: Array<any>) =>
    debug
      ? Effect.sync(() => {
          console.error("DEBUG", ...args)
        })
      : Effect.unit,
})

export interface Log extends ReturnType<typeof make> {}
export const Log = Tag<Log>()
export const LiveLog = Layer.succeed(Log, make(false))
export const LiveLogDebug = Layer.succeed(Log, make(true))
