import { Log } from "dfx/Log/index"
import {
  Context,
  Discord,
  Duration,
  Effect,
  Layer,
  Ref,
  Schedule,
  Stream,
} from "dfx/_common"
import WebSocket from "isomorphic-ws"
import * as WS from "../WS/index.js"

export type Message = Discord.GatewayPayload | WS.Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  outbound: Effect.Effect<never, never, Message>
}

export interface DiscordWSCodec {
  type: "json" | "etf"
  encode: (p: Discord.GatewayPayload) => string
  decode: (p: WebSocket.Data) => Discord.GatewayPayload
}
export const DiscordWSCodec = Context.Tag<DiscordWSCodec>()
export const LiveJsonDiscordWSCodec = Layer.succeed(DiscordWSCodec)({
  type: "json",
  encode: (p) => JSON.stringify(p),
  decode: (p) => JSON.parse(p.toString("utf8")),
})

export const make = ({
  url = "wss://gateway.discord.gg/",
  version = 10,
  outbound,
}: OpenOpts) =>
  Do(($) => {
    const encoding = $(Effect.service(DiscordWSCodec))
    const urlRef = $(Ref.make(`${url}?v=${version}&encoding=${encoding.type}`))
    const setUrl = (url: string) =>
      urlRef.set(`${url}?v=${version}&encoding=${encoding.type}`)
    const take = outbound.map((a) =>
      a === WS.Reconnect ? a : encoding.encode(a),
    )
    const log = $(Effect.service(Log))
    const ws = Stream.provideService(Log)(log)(WS.make(urlRef, take))
    const source = ws
      .tapError((e) => log.info("DiscordWS", "ERROR", e))
      .retry(Schedule.exponential(Duration.seconds(0.5)))
      .map(encoding.decode) as Stream.Stream<
      never,
      never,
      Discord.GatewayPayload
    >

    return { source, setUrl }
  })
