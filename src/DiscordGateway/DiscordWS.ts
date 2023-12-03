import { Tag } from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import { WSLive, Reconnect, WS } from "dfx/DiscordGateway/WS"
import type * as Discord from "dfx/types"
import type WebSocket from "isomorphic-ws"

export type Message = Discord.GatewayPayload | Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  outbound: Effect.Effect<never, never, Message>
  onConnecting?: Effect.Effect<never, never, void>
}

export interface DiscordWSCodecService {
  type: "json" | "etf"
  encode: (p: Discord.GatewayPayload) => string
  decode: (p: WebSocket.Data) => Discord.GatewayPayload
}
export interface DiscordWSCodec {
  readonly _: unique symbol
}
export const DiscordWSCodec = Tag<DiscordWSCodec, DiscordWSCodecService>(
  "dfx/DiscordGateway/DiscordWS/Codec",
)
export const JsonDiscordWSCodecLive = Layer.succeed(DiscordWSCodec, {
  type: "json",
  encode: p => JSON.stringify(p),
  decode: p => JSON.parse(p.toString("utf8")),
})

const make = Effect.gen(function* (_) {
  const ws = yield* _(WS)
  const encoding = yield* _(DiscordWSCodec)

  const connect = ({
    onConnecting,
    outbound,
    url = "wss://gateway.discord.gg/",
    version = 10,
  }: OpenOpts) =>
    Effect.gen(function* (_) {
      const urlRef = yield* _(
        Ref.make(`${url}?v=${version}&encoding=${encoding.type}`),
      )
      const setUrl = (url: string) =>
        Ref.set(urlRef, `${url}?v=${version}&encoding=${encoding.type}`)
      const takeOutbound = Effect.map(outbound, msg =>
        msg === Reconnect ? msg : encoding.encode(msg),
      )
      const socket = yield* _(
        ws.connect({
          urlRef,
          takeOutbound,
          onConnecting,
          reconnectWhen: e =>
            (e._tag === "WebSocketCloseError" && e.code < 2000) ||
            (e._tag === "WebSocketError" && e.reason === "open-timeout"),
        }),
      )
      const take = Effect.map(socket.take, encoding.decode)

      return {
        take,
        setUrl,
      } as const
    })

  return { connect } as const
})

export interface DiscordWS {
  readonly _: unique symbol
}
export const DiscordWS = Tag<DiscordWS, Effect.Effect.Success<typeof make>>(
  "dfx/DiscordGateway/DiscordWS",
)
export const DiscordWSLive = Layer.provide(
  Layer.effect(DiscordWS, make),
  WSLive,
)
