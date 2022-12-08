import WebSocket from "isomorphic-ws"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect

const socket = (urlRef: Ref<string>) =>
  Do(($) => {
    const url = $(urlRef.get)
    return new WebSocket(url) as any as globalThis.WebSocket
  }).acquireRelease((ws) =>
    Effect.sync(() => {
      ws.close()
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

const recv = (ws: globalThis.WebSocket) =>
  EffectSource.async<WebSocketError | WebSocketCloseError, WebSocket.Data>(
    (emit) => {
      ws.addEventListener("message", (message) => {
        emit.data(message.data)
      })

      ws.addEventListener("error", (cause) => {
        emit.fail(new WebSocketError(cause))
      })

      ws.addEventListener("close", (e) => {
        emit.fail(new WebSocketCloseError(e.code, e.reason))
      })

      return () => {
        ;(ws as any).removeAllListeners?.()
      }
    },
  )

const send = (ws: globalThis.WebSocket, take: Effect<never, never, Message>) =>
  Do(($) => {
    const log = $(Effect.service(Log.Log))
    return Effect.async<never, never, void>((resume) => {
      if (ws.readyState & ws.OPEN) {
        resume(Effect.unit())
      } else {
        ws.addEventListener(
          "open",
          () => {
            resume(Effect.unit())
          },
          { once: true },
        )
      }
    })
      .map(() => take.repeatEffectOption as EffectSource<never, never, Message>)
      .unwrap.tap((p) => log.debug("WS", "send", p))
      .tap((data) =>
        Effect.async<never, WebSocketCloseError, void>((resume) => {
          if (data === Reconnect) {
            ws.close(1012, "reconnecting")
            resume(Effect.fail(new WebSocketCloseError(1012, "reconnecting")))
          } else {
            ws.send(data)
            resume(Effect.unit())
          }
        }),
      ).drain
  })

export const make = (
  url: Ref<string>,
  takeOutbound: Effect<never, never, Message>,
) =>
  Do(($) => {
    const log = $(Effect.service(Log.Log))
    const withLog = Effect.provideService(Log.Log)(log)

    return Do(($) => {
      const ws = $(socket(url))
      const sendEffect = $(withLog(send(ws, takeOutbound)))
      return recv(ws).merge(sendEffect)
    }).unwrapScope.retry(
      Schedule.recurWhile(
        (e) => e._tag === "WebSocketCloseError" && e.code === 1012,
      ),
    )
  })
