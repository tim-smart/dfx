import { Log } from "dfx/Log"
import WebSocket from "isomorphic-ws"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import { Tag } from "@effect/data/Context"
import * as Ref from "@effect/io/Ref"
import * as Queue from "@effect/io/Queue"
import * as Runtime from "@effect/io/Runtime"
import * as Duration from "@effect/data/Duration"

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

const socket = (urlRef: Ref.Ref<string>) =>
  Ref.get(urlRef).pipe(
    Effect.map(_ => new WebSocket(_) as any as globalThis.WebSocket),
    Effect.acquireRelease(ws =>
      Effect.sync(() => {
        ;(ws as any).removeAllListeners?.()
        ws.close()
      }),
    ),
  )

const offer = (
  ws: globalThis.WebSocket,
  queue: Queue.Enqueue<WebSocket.Data>,
  log: Log,
) =>
  Effect.runtime<never>().pipe(
    Effect.flatMap(runtime =>
      Effect.async<never, WebSocketError | WebSocketCloseError, never>(
        resume => {
          const run = Runtime.runFork(runtime)
          ws.addEventListener("message", message => {
            run(
              Effect.all(
                log.debug("WS", "receive", message.data),
                Queue.offer(queue, message.data),
                { concurrency: "unbounded", discard: true },
              ),
            )
          })

          ws.addEventListener("error", cause => {
            resume(Effect.fail(new WebSocketError("error", cause)))
          })

          ws.addEventListener("close", e => {
            resume(Effect.fail(new WebSocketCloseError(e.code, e.reason)))
          })
        },
      ),
    ),
  )

const waitForOpen = (ws: globalThis.WebSocket, timeout: Duration.Duration) =>
  Effect.timeoutFail(
    Effect.suspend(() => {
      if (ws.readyState === WebSocket.OPEN) {
        return Effect.unit
      }

      return Effect.async<never, never, void>(resume => {
        ws.addEventListener("open", () => resume(Effect.unit), {
          once: true,
        })
      })
    }),
    {
      onTimeout: () => new WebSocketError("open-timeout"),
      duration: timeout,
    },
  )

const send = (
  ws: globalThis.WebSocket,
  take: Effect.Effect<never, never, Message>,
  log: Log,
) =>
  take.pipe(
    Effect.tap(data => log.debug("WS", "send", data)),
    Effect.tap(data => {
      if (data === Reconnect) {
        return Effect.failSync(() => {
          ws.close(1012, "reconnecting")
          return new WebSocketCloseError(1012, "reconnecting")
        })
      }

      return Effect.sync(() => {
        ws.send(data)
      })
    }),
    Effect.forever,
  )

const make = Effect.gen(function* (_) {
  const log = yield* _(Log)

  const connect = (
    url: Ref.Ref<string>,
    takeOutbound: Effect.Effect<never, never, Message>,
    onConnecting = Effect.unit,
    openTimeout = Duration.seconds(3),
  ) =>
    Effect.gen(function* (_) {
      const queue = yield* _(Queue.unbounded<WebSocket.Data>())

      const run = onConnecting.pipe(
        Effect.zipRight(socket(url)),
        Effect.flatMap(ws =>
          Effect.all(
            offer(ws, queue, log),
            waitForOpen(ws, openTimeout).pipe(
              Effect.zipRight(send(ws, takeOutbound, log)),
            ),
            { concurrency: "unbounded", discard: true },
          ),
        ),
        Effect.scoped,
        Effect.retryWhile(isReconnect),
      )

      return { run, take: Queue.take(queue) } as const
    })

  return { connect } as const
})

export interface WS extends Effect.Effect.Success<typeof make> {}
export const WS = Tag<WS>()
export const LiveWS = Layer.effect(WS, make)
