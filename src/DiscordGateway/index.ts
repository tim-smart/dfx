import { filter } from "callbag-effect-ts/Source"
import { spawn } from "./Sharder/index.js"

export const makeFromDispatch =
  <R, E>(
    source: EffectSource<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvent>(
    event: K,
  ): EffectSource<R, E, Discord.ReceiveEvent[K]> =>
    pipe(
      source,
      filter((p) => p.t === event),
    ).map((p) => p.d! as any)

export const make = Do(($) => {
  const shards = $(spawn.share)
  const raw = $(shards.chainPar((s) => s.raw).share)
  const dispatch = $(shards.chainPar((s) => s.dispatch).share)
  const fromDispatch = makeFromDispatch(dispatch)

  return {
    shards,
    raw,
    dispatch,
    fromDispatch,
  }
})

export interface DiscordGateway extends Success<typeof make> {}
export const DiscordGateway = Tag<DiscordGateway>()
export const LiveDiscordGateway = Layer.fromEffect(DiscordGateway)(make)
