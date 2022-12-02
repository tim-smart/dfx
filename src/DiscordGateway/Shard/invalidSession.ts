import { none } from "@fp-ts/data/Option"
import { opCode } from "./utils.js"

export const fromRaw = <R, E>(
  raw: EffectSource<R, E, Discord.GatewayPayload>,
  latestReady: Ref<Maybe<Discord.ReadyEvent>>,
) =>
  opCode(raw)<Discord.InvalidSessionEvent>(
    Discord.GatewayOpcode.INVALID_SESSION,
  )
    .tap((p) => (p.d ? Effect.unit() : latestReady.set(none)))
    .map((): DWS.Message => WS.Reconnect)
