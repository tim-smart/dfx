import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import * as CB from "callbag-effect-ts"
import { EffectSink, EffectSource } from "callbag-effect-ts"
import * as Ws from "ws"
import { logDebug } from "../../Log"

export type WsError =
  | { _tag: "close"; code: number; reason: string }
  | { _tag: "error"; cause: unknown }
  | { _tag: "write"; cause: unknown }

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect
export type Sink = EffectSink<unknown, never, never, Message>

type Outbound = EffectSource<unknown, never, Message>

const openSocket = (url: string, options?: Ws.ClientOptions) =>
  pipe(
    T.succeedWith(() => new Ws.WebSocket(url, options)),
    M.makeExit((ws) =>
      T.succeedWith(() => {
        ws.close()
        ws.removeAllListeners()
      }),
    ),
  )

const recv = (ws: Ws.WebSocket) =>
  CB.async<WsError, Ws.RawData>((emit) => {
    ws.on("message", (message) => emit.data(message))

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
      }),
    )
  })

const send = (ws: Ws.WebSocket, out: Outbound) =>
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
    T.map(() => out),
    CB.unwrap,
    CB.tap((p) => logDebug("WSService", "send", p)),
    CB.tap((data) =>
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
      }),
    ),
    CB.drain,
  )

const openDuplex = (url: string, options?: Ws.ClientOptions) => {
  const [sink, outbound] = CB.asyncSink<never, Message>()

  const source = pipe(
    openSocket(url, options),
    M.map((ws) => CB.merge_(recv(ws), send(ws, outbound))),
    CB.unwrapManaged,
    CB.retry(SC.recurWhile((e) => e._tag === "close" && e.code === 1012)),
  )

  return [source, sink] as const
}

const makeService = () =>
  ({
    _tag: "WSService",
    open: openDuplex,
  } as const)

export interface WS extends ReturnType<typeof makeService> {}
export const WS = tag<WS>()
export const LiveWS = T.toLayer(WS)(T.succeedWith(makeService))

// Helpers
export const open = (url: string, options?: Ws.ClientOptions) =>
  T.accessService(WS)(({ open }) => open(url, options))
