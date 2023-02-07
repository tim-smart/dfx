import { opCode } from "./utils.js"

export const fromRaw = <R, E>(
  raw: Stream<R, E, Discord.GatewayPayload>,
  latestReady: Ref<Maybe<Discord.ReadyEvent>>,
) =>
  opCode(raw)<Discord.InvalidSessionEvent>(
    Discord.GatewayOpcode.INVALID_SESSION,
  )
    .tap(p => (p.d ? Effect.unit() : latestReady.set(Maybe.none())))
    .map((): DiscordWS.Message => WS.Reconnect)
