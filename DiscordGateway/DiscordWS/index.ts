import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { Has, tag } from "@effect-ts/core/Has"
import { HasClock } from "@effect-ts/system/Clock"
import * as CB from "callbag-effect-ts"
import * as CBS from "callbag-effect-ts/Sink"
import { EffectSource } from "callbag-effect-ts"
import { RawData } from "ws"
import { log, Log } from "../../Log"
import { GatewayPayload } from "../../types"
import * as WS from "../WS"

export type Message = GatewayPayload | WS.Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: Encoding
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

const openImpl = ({
  url = "wss://gateway.discord.gg/",
  version = 9,
  encoding = jsonEncoding,
}: OpenOpts) =>
  pipe(
    T.do,
    T.bind("ws", () =>
      WS.open(`${url}?v=${version}&encoding=${encoding.type}`),
    ),
    T.bind("source", ({ ws: [wsSource] }) =>
      T.succeedWith(
        () =>
          pipe(
            wsSource,
            CB.tapError((e) => log(serviceTag, "error", e)),
            CB.retry(SC.exponential(500)),
            CB.map(encoding.decode),
          ) as EffectSource<
            Has<WS.WS> & Has<Log> & HasClock,
            never,
            GatewayPayload<any>
          >,
      ),
    ),
    T.bind("sink", ({ ws: [, wsSink] }) =>
      T.succeedWith(() =>
        CBS.map_(wsSink, (msg: Message) =>
          msg === WS.Reconnect ? msg : encoding.encode(msg),
        ),
      ),
    ),
    T.map(({ source, sink }) => [source, sink] as const),
  )

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
  T.accessServiceM(DiscordWS)(({ open }) => open(opts))
