import { ClientOptions, RawData, WebSocket } from "ws"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect

const socket = (urlRef: Ref<string>, options?: ClientOptions) =>
  Do(($) => {
    const url = $(urlRef.get)
    return new WebSocket(url, options)
  }).acquireRelease((ws) =>
    Effect.sync(() => {
      ws.close()
      ws.removeAllListeners()
    }),
  )

export class WebSocketError {
  readonly _tag = "WebSocketError"
  constructor(readonly reason: unknown) {}
}

export class WebSocketCloseError {
  readonly _tag = "WebSocketCloseError"
  constructor(readonly code: number, readonly reason: string) {}
}

const recv = (ws: WebSocket) =>
  EffectSource.async<WebSocketError | WebSocketCloseError, RawData>((emit) => {
    ws.on("message", (message) => emit.data(message))

    ws.on("error", (cause) => {
      emit.fail(new WebSocketError(cause))
    })

    ws.on("close", (code, reason) =>
      emit.fail(new WebSocketCloseError(code, reason.toString("utf8"))),
    )
  })

export class WebSocketWriteError {
  readonly _tag = "WebSocketWriteError"
  constructor(readonly reason: Error) {}
}

const send = (ws: WebSocket, out: EffectSource<never, never, Message>) =>
  Do(($) => {
    const log = $(Effect.service(Log.Log))
    return Effect.async<never, never, void>((resume) => {
      if (ws.readyState & ws.OPEN) {
        resume(Effect.unit())
      } else {
        ws.once("open", () => {
          resume(Effect.unit())
        })
      }
    })
      .map(() => out)
      .unwrap.tap((p) => log.debug("WS", "send", p))
      .tap((data) =>
        Effect.async<never, WebSocketWriteError, void>((resume) => {
          if (data === Reconnect) {
            ws.close(1012, "reconnecting")
            resume(Effect.unit())
          } else {
            ws.send(data, (err) => {
              resume(
                err
                  ? Effect.fail(new WebSocketWriteError(err!))
                  : Effect.unit(),
              )
            })
          }
        }),
      ).drain
  })

export const make = (url: Ref<string>, options?: ClientOptions) =>
  Do(($) => {
    const [sink, outbound] = EffectSource.asyncSink<never, Message>()
    const log = $(Effect.service(Log.Log))
    const withLog = provideService(Log.Log)(log)

    const source = Do(($) => {
      const ws = $(socket(url, options))
      const sendEffect = $(withLog(send(ws, outbound)))
      return recv(ws).merge(sendEffect)
    }).unwrapScope.retry(
      Schedule.recurWhile(
        (e) => e._tag === "WebSocketCloseError" && e.code === 1012,
      ),
    )

    return { source, sink }
  })
