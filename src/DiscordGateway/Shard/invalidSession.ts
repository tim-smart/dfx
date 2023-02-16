export const fromPayload = (
  p: Discord.GatewayPayload,
  latestReady: Ref<Maybe<Discord.ReadyEvent>>,
) =>
  (p.d ? Effect.unit() : latestReady.set(Maybe.none())).map(
    (): DiscordWS.Message => WS.Reconnect,
  )
