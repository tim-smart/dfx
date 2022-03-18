import * as T from "@effect-ts/core/Effect"
import * as Q from "@effect-ts/core/Effect/Queue"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import * as CB from "callbag-effect-ts"
import { RawData } from "ws"
import { log } from "../Log"
import { GatewayOpcode, GatewayPayload } from "../types"
import * as WS from "../WS"

export type Message = GatewayPayload | WS.Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: Encoding
  outgoingQueue: Q.Queue<Message>
}

export interface Encoding {
  type: "json" | "etf"
  encode: (p: GatewayPayload) => string | Buffer | ArrayBuffer
  decode: (p: RawData) => GatewayPayload
}

export const jsonEncoding: Encoding = {
  type: "json",
  encode: (p) => JSON.stringify(p),
  decode: (p) => JSON.parse(p.toString("utf8")),
}

const makeOutgoing = (q: Q.Queue<Message>, e: Encoding): WS.OutboundQueue =>
  Q.map_(q, (data): WS.Message => {
    if (data === WS.Reconnect) {
      return data
    }

    return e.encode(data)
  })

const openImpl = ({
  url = "wss://gateway.discord.gg/",
  version = 9,
  encoding = jsonEncoding,
  outgoingQueue: outgoing,
}: OpenOpts) =>
  pipe(
    WS.open(
      `${url}?v=${version}&encoding=${encoding.type}`,
      makeOutgoing(outgoing, encoding),
    ),
    CB.unwrap,
    CB.tapError((e) => log(serviceTag, "error", e)),
    CB.retry(SC.exponential(500)),
    CB.map(encoding.decode),
  )

export type Connection = ReturnType<typeof openImpl>

// Service definition
const serviceTag = "DiscordWSService" as const
const service = {
  _tag: serviceTag,
  open: openImpl,
} as const
type Service = typeof service
export interface DiscordWS extends Service {}
export const DiscordWS = tag<DiscordWS>()
export const LiveDiscordWS = T.toLayer(DiscordWS)(T.succeed(service))

// Helpers
export const open = (opts: OpenOpts) =>
  T.accessService(DiscordWS)(({ open }) => open(opts))
