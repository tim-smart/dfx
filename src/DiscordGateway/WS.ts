import { Log } from "dfx/Log"
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

const isReconnect = (
  e: WebSocketError | WebSocketCloseError,
): e is WebSocketCloseError =>
  e._tag === "WebSocketCloseError" && e.code === 1012

const socket = (urlRef: Ref<string>) =>
  Do($ => {
    const url = $(urlRef.get)
    const ws = new WebSocket(url) as any as globalThis.WebSocket

    $(
      Effect.async<never, never, void>(resume => {
        ws.addEventListener("open", () => resume(Effect.unit()), {
          once: true,
        })
      }),
    )

    return ws
  }).acquireRelease(ws =>
    Effect.sync(() => {
      ;(ws as any).removeAllListeners?.()
      ws.close()
    }),
  )

const offer = (
  ws: globalThis.WebSocket,
  queue: Enqueue<WebSocket.Data>,
  log: Log,
) =>
  Effect.async<never, WebSocketError | WebSocketCloseError, never>(resume => {
    ws.addEventListener("message", message => {
      queue.offer(message.data).zipLeft(log.debug("WS", "offer", message.data))
        .runFork
    })

    ws.addEventListener("error", cause => {
      resume(Effect.fail(new WebSocketError(cause)))
    })

    ws.addEventListener("close", e => {
      resume(Effect.fail(new WebSocketCloseError(e.code, e.reason)))
    })
  })

const send = (
  ws: globalThis.WebSocket,
  take: Effect<never, never, Message>,
  log: Log,
) =>
  take
    .tap(data => log.debug("WS", "send", data))
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

const make = Do($ => {
  const log = $(Log)

  const connect = (
    url: Ref<string>,
    takeOutbound: Effect<never, never, Message>,
    onReconnect = Effect.unit(),
  ) =>
    Do($ => {
      const queue = $(Queue.unbounded<WebSocket.Data>())

      const run = Do($ => {
        const ws = $(socket(url))
        return $(offer(ws, queue, log).zipParLeft(send(ws, takeOutbound, log)))
      })
        .tapError(_ => (isReconnect(_) ? onReconnect : Effect.unit()))
        .retryWhile(isReconnect).scoped

      return { run, take: queue.take() } as const
    })

  return { connect } as const
})

export interface WS extends Effect.Success<typeof make> {}
export const WS = Tag<WS>()
export const LiveWS = make.toLayer(WS)
