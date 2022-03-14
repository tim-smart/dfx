import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as M from "@effect-ts/core/Effect/Managed"
import * as Q from "@effect-ts/core/Effect/Queue"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import type { _A } from "@effect-ts/core/Utils"
import { HasClock } from "@effect-ts/system/Clock"
import * as Ws from "ws"

export type WsError =
  | { _tag: "close"; code: number; reason: string }
  | { _tag: "error"; cause: unknown }
  | { _tag: "write"; cause: unknown }

type WebSocketStream = S.Stream<HasClock, WsError, Ws.RawData>

export const Reconnect = Symbol()
export type Message = Ws.RawData | typeof Reconnect

export interface WebSocketConnection {
  read: WebSocketStream
  write: Q.Queue<Message>
}

const open = (url: string, options?: Ws.ClientOptions) =>
  pipe(
    T.succeedWith(() => new Ws.WebSocket(url, options)),
    M.makeExit((ws) =>
      T.succeedWith(() => {
        ws.removeAllListeners()
        ws.close()
      })
    )
  )

const recv = (ws: Ws.WebSocket): WebSocketStream =>
  S.async<unknown, WsError, Ws.RawData>((emit) => {
    ws.on("message", (message) => emit.single(message))
    ws.on("error", (cause) => {
      emit.fail({
        _tag: "error",
        cause,
      })
    })
    ws.on("close", (code, reason) =>
      emit.fail({
        _tag: "close",
        code,
        reason: reason.toString("utf8"),
      })
    )
  })

const send = (out: Q.Queue<Message>) => (ws: Ws.WebSocket) =>
  pipe(
    T.effectAsync<unknown, WsError, void>((cb) => {
      if (ws.readyState & ws.OPEN) {
        cb(T.unit)
      } else {
        ws.once("open", () => {
          cb(T.unit)
        })
      }
    }),
    T.map(() => S.fromQueue()(out)),
    S.unwrap,
    S.tap((data) =>
      T.effectAsync<unknown, WsError, void>((cb) => {
        if (data === Reconnect) {
          ws.close(1012, "reconnecting")
          cb(T.unit)
        } else {
          ws.send(data, (err) => {
            if (err) {
              cb(T.fail({ _tag: "write", cause: err }))
            } else {
              cb(T.unit)
            }
          })
        }
      })
    ),
    S.drain
  )

const duplex = (out: Q.Queue<Message>) => (ws: Ws.WebSocket) =>
  pipe(recv(ws), S.mergeTerminateLeft(send(out)(ws)))

const openDuplexWithQueue = (
  url: string,
  out: Q.Queue<Message>,
  options?: Ws.ClientOptions
): WebSocketStream =>
  pipe(
    open(url, options),
    M.map(duplex(out)),
    S.unwrapManaged,
    S.retry(SC.recurWhile((e) => e._tag === "close" && e.code === 1012))
  )

const openDuplex = (
  url: string,
  options?: Ws.ClientOptions
): T.UIO<WebSocketConnection> =>
  pipe(
    Q.makeUnbounded<Message>(),
    T.map((write) => ({
      read: openDuplexWithQueue(url, write, options),
      write,
    }))
  )

const makeWS = T.succeed({
  _tag: "WSService",
  open: openDuplex,
} as const)

export interface WS extends _A<typeof makeWS> {}
export const WS = tag<WS>()
export const LiveWS = T.toLayer(WS)(makeWS)
