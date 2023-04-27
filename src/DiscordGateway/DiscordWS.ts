import {
  LiveWS,
  Reconnect,
  WS,
  WebSocketCloseError,
  WebSocketError,
} from "dfx/DiscordGateway/WS"
import { Log } from "dfx/Log"
import WebSocket from "isomorphic-ws"

export type Message = Discord.GatewayPayload | Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  outbound: Effect<never, never, Message>
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

const make = Do($ => {
  const ws = $(WS)
  const encoding = $(DiscordWSCodec)
  const log = $(Log)

  const connect = ({
    url = "wss://gateway.discord.gg/",
    version = 10,
    outbound,
  }: OpenOpts) =>
    Do($ => {
      const urlRef = $(
        Ref.make(`${url}?v=${version}&encoding=${encoding.type}`),
      )
      const setUrl = (url: string) =>
        urlRef.set(`${url}?v=${version}&encoding=${encoding.type}`)
      const takeOutbound = outbound.map(a =>
        a === Reconnect ? a : encoding.encode(a),
      )
      const socket = $(ws.connect(urlRef, takeOutbound))
      const take = socket.take.map(encoding.decode)

      const run = socket.run.retry(
        Schedule.exponential(Duration.seconds(0.5)).whileInput(
          (_: WebSocketError | WebSocketCloseError) =>
            _._tag === "WebSocketCloseError" && _.code < 2000,
        ),
      )

      return {
        run,
        take,
        setUrl,
      } as const
    })

  return { connect } as const
})

export interface DiscordWS extends Effect.Success<typeof make> {}
export const DiscordWS = Tag<DiscordWS>()
export const LiveDiscordWS = LiveWS >> make.toLayer(DiscordWS)
