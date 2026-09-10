import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import type * as Discord from "../types.ts"
import * as Schedule from "effect/Schedule"
import * as Cause from "effect/Cause"
import * as Context from "effect/Context"
import * as Queue from "effect/Queue"
import * as Socket from "effect/unstable/socket/Socket"
import type * as Scope from "effect/Scope"
import { CurrentLoggers } from "effect/Logger"
import * as LogLevel from "effect/LogLevel"
import { MinimumLogLevel } from "effect/References"

export type Message = Discord.GatewayReceivePayload
export type MessageSend = Discord.GatewaySendPayload | Reconnect

export const Reconnect = Symbol.for("dfx/DiscordGateway/WS/Reconnect")
export type Reconnect = typeof Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  onConnecting: Effect.Effect<void>
}

export interface DiscordWSCodecService {
  type: "json" | "etf"
  encode: (p: Discord.GatewaySendPayload) => Uint8Array | string
  decode: (p: Uint8Array | string) => Discord.GatewayReceivePayload
}

const decoder = new TextDecoder()

export class DiscordWSCodec extends Context.Service<
  DiscordWSCodec,
  DiscordWSCodecService
>()("dfx/DiscordGateway/DiscordWS/Codec") {}

export const JsonDiscordWSCodecLive = Layer.succeed(DiscordWSCodec, {
  type: "json",
  encode: p => JSON.stringify(p),
  decode: p => JSON.parse(typeof p === "string" ? p : decoder.decode(p)),
})

const make = Effect.gen(function* () {
  const encoding = yield* DiscordWSCodec

  const connect = Effect.fnUntraced(
    function* ({
      onConnecting,
      url = "wss://gateway.discord.gg/",
      version = 10,
    }: OpenOpts) {
      const urlRef = yield* Ref.make(
        `${url}?v=${version}&encoding=${encoding.type}`,
      )
      const setUrl = (nextUrl: string) =>
        Ref.set(urlRef, `${nextUrl}?v=${version}&encoding=${encoding.type}`)
      const messages = yield* Queue.make<Message>()
      const socket = yield* Socket.makeWebSocket(Ref.get(urlRef), {
        openTimeout: 5000,
      })
      const writer = yield* socket.writer
      const logWriteError = (cause: Cause.Cause<Socket.SocketError>) =>
        Effect.annotateLogs(Effect.logDebug(cause), {
          module: "DiscordGateway/DiscordWS",
          channel: "outbound",
        })
      const write = (message: MessageSend): Effect.Effect<void> => {
        if (message === Reconnect) {
          return Effect.catchCause(
            writer.write(new Socket.CloseEvent(3000, "reconnecting")),
            logWriteError,
          )
        }
        return Effect.catchCause(
          writer.write(encoding.encode(message)),
          logWriteError,
        )
      }
      const traceEnabled = LogLevel.isLessThanOrEqualTo(
        yield* MinimumLogLevel,
        "Trace",
      )
      const loggers = yield* CurrentLoggers
      yield* Effect.gen(function* () {
        const fiber = yield* Effect.fiber
        yield* onConnecting
        const reader = yield* socket.reader
        return yield* Effect.whileLoop({
          while: () => true,
          body: () => reader.pull,
          step(chunk) {
            const decoded = chunk.map(encoding.decode)
            Queue.offerAllUnsafe(messages, decoded)
            Queue.flushUnsafe(messages)
            if (!traceEnabled) return
            loggers.forEach(logger => {
              for (let i = 0; i < decoded.length; i++) {
                logger.log({
                  message: decoded[i],
                  cause: Cause.empty,
                  fiber,
                  logLevel: "Trace",
                  date: new Date(),
                })
              }
            })
          },
        })
      }).pipe(
        Effect.retry({
          while: e =>
            // oxlint-disable-next-line no-underscore-dangle
            e.reason._tag === "SocketCloseError" && e.reason.code === 3000,
        }),
        Effect.catchCause(cause =>
          Effect.logDebug("Got socket error, reconnecting", cause),
        ),
        Effect.repeat(
          Schedule.min([Schedule.exponential(500), Schedule.spaced(10000)]),
        ),
        Effect.annotateLogs("channel", "inbound"),
        Effect.forkScoped,
      )

      return {
        take: Queue.take(messages),
        setUrl,
        write,
      } as const
    },
    Effect.annotateLogs({
      module: "DiscordGateway/DiscordWS",
    }),
  )

  return { connect } as const
})

export class DiscordWS extends Context.Service<
  DiscordWS,
  {
    readonly connect: (args_0: OpenOpts) => Effect.Effect<
      {
        readonly take: Effect.Effect<
          Discord.GatewayReceivePayload,
          never,
          never
        >
        readonly setUrl: (url: string) => Effect.Effect<void, never, never>
        readonly write: (message: MessageSend) => Effect.Effect<void>
      },
      never,
      Socket.WebSocketConstructor | Scope.Scope
    >
  }
>()("dfx/DiscordGateway/DiscordWS") {}

export const DiscordWSLive = Layer.effect(DiscordWS, make)
