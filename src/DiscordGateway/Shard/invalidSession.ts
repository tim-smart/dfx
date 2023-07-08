import { Message } from "../DiscordWS.js"
import { Reconnect } from "../WS.js"

export const fromPayload = (
  p: Discord.GatewayPayload,
  latestReady: Ref<Maybe<Discord.ReadyEvent>>,
) =>
  (p.d ? Effect.unit : latestReady.set(Maybe.none())).map(
    (): Message => Reconnect,
  )
