import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import * as Q from "@effect-ts/core/Effect/Queue"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { tag, Has } from "@effect-ts/core/Has"
import { HasClock } from "@effect-ts/system/Clock"
import * as CB from "callbag-effect-ts"
import { EffectSource } from "callbag-effect-ts"
import { RawData } from "ws"
import { log, Log } from "../Log"
import { GatewayPayload } from "../types"
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
  Q.map_(q, (data) => (data === WS.Reconnect ? data : e.encode(data)))

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
  ) as EffectSource<
    Has<WS.WS> & Has<Log> & HasClock,
    never,
    GatewayPayload<any>
  >

export type Connection = ReturnType<typeof openImpl>

// Service definition
const serviceTag = "DiscordWSService" as const
const makeService = () =>
  ({
    _tag: serviceTag,
    open: openImpl,
  } as const)

export interface DiscordWS extends ReturnType<typeof makeService> {}
export const DiscordWS = tag<DiscordWS>()
export const LiveDiscordWS = L.fromFunction(DiscordWS)(makeService)

// Helpers
export const open = (opts: OpenOpts) =>
  T.accessService(DiscordWS)(({ open }) => open(opts))
