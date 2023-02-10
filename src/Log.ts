const make = (debug = false) => ({
  info: (...args: any[]) =>
    Effect.sync(() => {
      console.error("INFO", ...args)
    }),
  debug: (...args: any[]) =>
    debug
      ? Effect.sync(() => {
          console.error("DEBUG", ...args)
        })
      : Effect.unit(),
})

export interface Log extends ReturnType<typeof make> {}
export const Log = Tag<Log>()
export const LiveLog = Layer.succeed(Log, make(false))
export const LiveLogDebug = Layer.succeed(Log, make(true))

export const info = (...args: any[]) =>
  Effect.serviceWithEffect(Log, ({ info: log }) => log(...args))

export const debug = (...args: any[]) =>
  Effect.serviceWithEffect(Log, ({ debug }) => debug(...args))
