import { Log } from "dfx/Log"
import WebSocket from "isomorphic-ws"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Buffer | ArrayBuffer | Reconnect

export class WebSocketError {
  readonly _tag = "WebSocketError"
  constructor(
    readonly reason: "open-timeout" | "error",
    readonly error?: unknown,
  ) {}
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
  urlRef.get
    .map(_ => new WebSocket(_) as any as globalThis.WebSocket)
    .acquireRelease(ws =>
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
  Effect.runtime<never>().flatMap(runtime =>
    Effect.async<never, WebSocketError | WebSocketCloseError, never>(resume => {
      const run = runtime.runFork
      ws.addEventListener("message", message => {
        run(
          queue
            .offer(message.data)
            .zipLeft(log.debug("WS", "offer", message.data)),
        )
      })

      ws.addEventListener("error", cause => {
        resume(Effect.fail(new WebSocketError("error", cause)))
      })

      ws.addEventListener("close", e => {
        resume(Effect.fail(new WebSocketCloseError(e.code, e.reason)))
      })
    }),
  )

const waitForOpen = (ws: globalThis.WebSocket, timeout: Duration) =>
  Effect.suspend(() => {
    if (ws.readyState === WebSocket.OPEN) {
      return Effect.unit()
    }

    return Effect.async<never, never, void>(resume => {
      ws.addEventListener("open", () => resume(Effect.unit()), {
        once: true,
      })
    })
  }).timeoutFail(() => new WebSocketError("open-timeout"), timeout)

const send = (
  ws: globalThis.WebSocket,
  take: Effect<never, never, Message>,
  log: Log,
) =>
  take
    .tap(data => log.debug("WS", "send", data))
    .tap(data => {
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
    openTimeout = Duration.seconds(3),
  ) =>
    Do($ => {
      const queue = $(Queue.unbounded<WebSocket.Data>())

      const run = socket(url)
        .flatMap(ws =>
          offer(ws, queue, log).zipParLeft(
            waitForOpen(ws, openTimeout).zipRight(send(ws, takeOutbound, log)),
          ),
        )
        .scoped.tapError(_ => (isReconnect(_) ? onReconnect : Effect.unit()))
        .retryWhile(isReconnect)

      return { run, take: queue.take() } as const
    })

  return { connect } as const
})

export interface WS extends Effect.Success<typeof make> {}
export const WS = Tag<WS>()
export const LiveWS = make.toLayer(WS)
