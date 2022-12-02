import { RawData } from "ws"

export type Message = Discord.GatewayPayload | WS.Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: Encoding
}

export interface Encoding {
  type: "json" | "etf"
  encode: (p: Discord.GatewayPayload) => string | Buffer | ArrayBuffer
  decode: (p: RawData) => Discord.GatewayPayload
}

export const jsonEncoding: Encoding = {
  type: "json",
  encode: (p) => JSON.stringify(p),
  decode: (p) => JSON.parse(p.toString("utf8")),
}

export const make = ({
  url = "wss://gateway.discord.gg/",
  version = 9,
  encoding = jsonEncoding,
}: OpenOpts) => {
  const ws = WS.make(`${url}?v=${version}&encoding=${encoding.type}`)

  const source = ws.source
    .tapError((e) => Log.info("DiscordWS", "ERROR", e))
    .retry(Schedule.exponential(Duration.seconds(0.5)))
    .map(encoding.decode)

  const sink = ws.sink.map((msg: Message) =>
    msg === WS.Reconnect ? msg : encoding.encode(msg),
  )

  return { source, sink }
}
