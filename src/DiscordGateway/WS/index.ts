import WebSocket from "isomorphic-ws"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect

const socket = (urlRef: Ref<string>, options?: WebSocket.ClientOptions) =>
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
  EffectSource.async<WebSocketError | WebSocketCloseError, WebSocket.RawData>(
    (emit) => {
      ws.on("message", (message) => {
        emit.data(message)
      })

      ws.on("error", (cause) => {
        emit.fail(new WebSocketError(cause))
      })

      ws.on("close", (code, reason) => {
        emit.fail(new WebSocketCloseError(code, reason.toString("utf8")))
      })
    },
  )

export class WebSocketWriteError {
  readonly _tag = "WebSocketWriteError"
  constructor(readonly reason: Error) {}
}

const send = (ws: WebSocket, take: Effect<never, never, Message>) =>
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
      .map(() => take.repeatEffectOption as EffectSource<never, never, Message>)
      .unwrap.tap((p) => log.debug("WS", "send", p))
      .tap((data) =>
        Effect.async<never, WebSocketWriteError | WebSocketCloseError, void>(
          (resume) => {
            if (data === Reconnect) {
              ws.close(1012, "reconnecting")
              resume(Effect.fail(new WebSocketCloseError(1012, "reconnecting")))
            } else {
              ws.send(data, (err) => {
                resume(
                  err
                    ? Effect.fail(new WebSocketWriteError(err!))
                    : Effect.unit(),
                )
              })
            }
          },
        ),
      ).drain
  })

export const make = (
  url: Ref<string>,
  takeOutbound: Effect<never, never, Message>,
  options?: WebSocket.ClientOptions,
) =>
  Do(($) => {
    const log = $(Effect.service(Log.Log))
    const withLog = Effect.provideService(Log.Log)(log)

    return Do(($) => {
      const ws = $(socket(url, options))
      const sendEffect = $(withLog(send(ws, takeOutbound)))
      return recv(ws).merge(sendEffect)
    }).unwrapScope.retry(
      Schedule.recurWhile(
        (e) => e._tag === "WebSocketCloseError" && e.code === 1012,
      ),
    )
  })
