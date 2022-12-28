import WebSocket from "isomorphic-ws"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect

export class WebSocketError {
  readonly _tag = "WebSocketError"
  constructor(readonly reason: unknown) {}
}

export class WebSocketCloseError {
  readonly _tag = "WebSocketCloseError"
  constructor(readonly code: number, readonly reason: string) {}
}

const socket = (urlRef: Ref<string>) =>
  Do(($) => {
    const url = $(urlRef.get)
    const ws = new WebSocket(url) as any as globalThis.WebSocket

    $(
      Effect.async<never, never, void>((resume) => {
        ws.addEventListener("open", () => resume(Effect.unit()), {
          once: true,
        })
      }),
    )

    return ws
  }).acquireRelease((ws) =>
    Effect.sync(() => {
      ;(ws as any).removeAllListeners?.()
      ws.close()
    }),
  )

const recv = (ws: globalThis.WebSocket) =>
  Stream.asyncEffect<
    never,
    WebSocketError | WebSocketCloseError,
    WebSocket.Data
  >((emit) =>
    Effect.sync(() => {
      ws.addEventListener("message", (message) => {
        emit.single(message.data)
      })

      ws.addEventListener("error", (cause) => {
        emit.fail(new WebSocketError(cause))
      })

      ws.addEventListener("close", (e) => {
        emit.fail(new WebSocketCloseError(e.code, e.reason))
      })
    }),
  )

const send = (
  ws: globalThis.WebSocket,
  take: Effect<never, never, Message>,
  log: Log.Log,
) =>
  take
    .tap((data) => log.debug("WS", "send", data))
    .tap((data): Effect<never, WebSocketCloseError, void> => {
      if (data === Reconnect) {
        return Effect.failSync(() => {
          ws.close(1012, "reconnecting")
          return new WebSocketCloseError(1012, "reconnecting")
        })
      }

      return Effect.sync(() => {
        ws.send(data)
      })
    }).forever

export const make = (
  url: Ref<string>,
  takeOutbound: Effect<never, never, Message>,
) =>
  pipe(
    Do(($) => {
      const log = $(Effect.service(Log.Log))
      const ws = $(socket(url))
      const sendEffect = send(ws, takeOutbound, log)

      return recv(ws)
        .merge(Stream.fromEffect(sendEffect))
        .retry(
          Schedule.recurWhile(
            (e) => e._tag === "WebSocketCloseError" && e.code === 1012,
          ),
        )
    }),
    Stream.unwrapScoped,
  )
