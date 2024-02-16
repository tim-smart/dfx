import { GenericTag } from "effect/Context"
import type * as Duration from "effect/Duration"
import { identity, pipe } from "effect/Function"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import WebSocket from "isomorphic-ws"
import type { Predicate } from "effect/Predicate"
import * as Schedule from "effect/Schedule"

export const Reconnect = Symbol()
export type Reconnect = typeof Reconnect
export type Message = string | Uint8Array | ArrayBuffer | Reconnect

export class WebSocketError {
  readonly _tag = "WebSocketError"
  constructor(
    readonly reason: "open-timeout" | "error",
    readonly error?: unknown,
  ) {}
}

export class WebSocketCloseError {
  readonly _tag = "WebSocketCloseError"
  constructor(
    readonly code: number,
    readonly reason: string,
  ) {}
}

const isReconnect = (
  e: WebSocketError | WebSocketCloseError,
): e is WebSocketCloseError =>
  e._tag === "WebSocketCloseError" && e.code === 1012

const socket = (urlRef: Ref.Ref<string>) =>
  pipe(
    Ref.get(urlRef),
    Effect.map(_ => new WebSocket(_) as any as globalThis.WebSocket),
    Effect.acquireRelease(ws =>
      Effect.sync(() => {
        // eslint-disable-next-line no-extra-semi
        ;(ws as any).removeAllListeners?.()
        ws.close()
      }),
    ),
  )

const offer = (
  ws: globalThis.WebSocket,
  queue: Queue.Enqueue<WebSocket.Data>,
) =>
  Effect.async<never, WebSocketError | WebSocketCloseError>(resume => {
    ws.addEventListener("message", message => {
      Queue.unsafeOffer(queue, message.data)
    })

    ws.addEventListener("error", cause => {
      resume(Effect.fail(new WebSocketError("error", cause)))
    })

    ws.addEventListener("close", e => {
      resume(Effect.fail(new WebSocketCloseError(e.code, e.reason)))
    })
  })

const waitForOpen = (
  ws: globalThis.WebSocket,
  timeout: Duration.DurationInput,
) =>
  Effect.timeoutFail(
    Effect.suspend(() => {
      if (ws.readyState === WebSocket.OPEN) {
        return Effect.unit
      }

      return Effect.async<void>(resume => {
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

const send = (ws: globalThis.WebSocket, take: Effect.Effect<Message>) =>
  pipe(
    take,
    Effect.tap(data => Effect.logTrace(data)),
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
    Effect.annotateLogs("method", "send"),
  )

const wsImpl = {
  connect: ({
    onConnecting = Effect.unit,
    openTimeout = "3 seconds",
    reconnectWhen,
    takeOutbound,
    urlRef,
  }: {
    readonly urlRef: Ref.Ref<string>
    readonly takeOutbound: Effect.Effect<Message>
    readonly onConnecting?: Effect.Effect<void>
    readonly openTimeout?: Duration.DurationInput
    readonly reconnectWhen?: Predicate<WebSocketError | WebSocketCloseError>
  }) =>
    Effect.gen(function* (_) {
      const scope = yield* _(Effect.scope)
      const queue = yield* _(
        Effect.acquireRelease(
          Queue.unbounded<WebSocket.Data>(),
          Queue.shutdown,
        ),
      )
      const take = Effect.annotateLogs(
        Effect.tap(Queue.take(queue), data => Effect.logTrace(data)),
        {
          package: "dfx",
          module: "DiscordGateway/WS",
          method: "take",
        },
      )

      const run = pipe(
        onConnecting,
        Effect.zipRight(socket(urlRef)),
        Effect.flatMap(ws =>
          Effect.all(
            [
              offer(ws, queue),
              Effect.zipRight(
                waitForOpen(ws, openTimeout),
                send(ws, takeOutbound),
              ),
            ],
            { concurrency: "unbounded", discard: true },
          ),
        ),
        Effect.scoped,
        Effect.retry({ while: isReconnect }),
        reconnectWhen ? Effect.retry({ while: reconnectWhen }) : identity,
        Effect.catchAllCause(Effect.logError),
        Effect.repeat(
          Schedule.exponential("500 millis").pipe(
            Schedule.union(Schedule.spaced("30 seconds")),
          ),
        ),
        Effect.forkIn(scope),
      )

      yield* _(run)

      return { take } as const
    }).pipe(
      Effect.annotateLogs({
        package: "dfx",
        module: "DiscordGateway/WS",
      }),
    ),
} as const

export interface WS {
  readonly _: unique symbol
}
export const WS = GenericTag<WS, typeof wsImpl>("dfx/DiscordGateway/WS")
export const WSLive = Layer.succeed(WS, wsImpl)
