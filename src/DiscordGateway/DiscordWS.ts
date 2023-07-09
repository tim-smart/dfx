import { LiveWS, Reconnect, WS } from "dfx/DiscordGateway/WS"
import WebSocket from "isomorphic-ws"
import * as Discord from "dfx/types"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import { Tag } from "@effect/data/Context"
import * as Ref from "@effect/io/Ref"

export type Message = Discord.GatewayPayload | Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  outbound: Effect.Effect<never, never, Message>
  onConnecting?: Effect.Effect<never, never, void>
}

export interface DiscordWSCodec {
  type: "json" | "etf"
  encode: (p: Discord.GatewayPayload) => string
  decode: (p: WebSocket.Data) => Discord.GatewayPayload
}
export const DiscordWSCodec = Tag<DiscordWSCodec>()
export const LiveJsonDiscordWSCodec = Layer.succeed(DiscordWSCodec, {
  type: "json",
  encode: p => JSON.stringify(p),
  decode: p => JSON.parse(p.toString("utf8")),
})

const make = Effect.gen(function* (_) {
  const ws = yield* _(WS)
  const encoding = yield* _(DiscordWSCodec)

  const connect = ({
    url = "wss://gateway.discord.gg/",
    version = 10,
    outbound,
    onConnecting,
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
      const socket = yield* _(ws.connect(urlRef, takeOutbound, onConnecting))
      const take = Effect.map(socket.take, encoding.decode)

      const run = Effect.retryWhile(
        socket.run,
        e =>
          (e._tag === "WebSocketCloseError" && e.code < 2000) ||
          (e._tag === "WebSocketError" && e.reason === "open-timeout"),
      )

      return {
        run,
        take,
        setUrl,
      } as const
    })

  return { connect } as const
})

export interface DiscordWS extends Effect.Effect.Success<typeof make> {}
export const DiscordWS = Tag<DiscordWS>()
export const LiveDiscordWS = Layer.provide(
  LiveWS,
  Layer.effect(DiscordWS, make),
)
