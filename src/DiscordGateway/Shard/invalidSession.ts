import { DiscordWS, WS } from "dfx/gateway"
import { Discord, Effect, Option, Ref, Stream } from "dfx/_common"
import { opCode } from "./utils.js"

export const fromRaw = <R, E>(
  raw: Stream.Stream<R, E, Discord.GatewayPayload>,
  latestReady: Ref.Ref<Option.Option<Discord.ReadyEvent>>,
) =>
  opCode(raw)<Discord.InvalidSessionEvent>(
    Discord.GatewayOpcode.INVALID_SESSION,
  )
    .tap((p) => (p.d ? Effect.unit() : latestReady.set(Option.none)))
    .map((): DiscordWS.Message => WS.Reconnect)
