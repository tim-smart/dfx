import WebSocket from "isomorphic-ws"
import { LiveWS } from "./WS.js"

export type Message = Discord.GatewayPayload | WS.Reconnect

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
  const ws = $(WS.WS.access)
  const encoding = $(Effect.service(DiscordWSCodec))
  const log = $(Effect.service(Log.Log))

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
      const take = outbound.map(a =>
        a === WS.Reconnect ? a : encoding.encode(a),
      )
      const socket = $(ws.connect(urlRef, take))
      const [queue, offer] = $(socket.queue.transform(encoding.decode))

      const run = socket.run
        .zipParLeft(offer)
        .tapError(e => log.info("DiscordWS", "ERROR", e))
        .retry(Schedule.exponential(Duration.seconds(0.5))) as Effect<
        never,
        never,
        never
      >

      return {
        run,
        queue: queue as Dequeue<Discord.GatewayPayload>,
        setUrl,
      } as const
    })

  return { connect } as const
})

export interface DiscordWS extends Effect.Success<typeof make> {}
export const DiscordWS = Tag<DiscordWS>()
export const LiveDiscordWS = LiveWS >> make.toLayer(DiscordWS)
