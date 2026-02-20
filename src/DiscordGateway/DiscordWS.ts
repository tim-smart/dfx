import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import type * as Discord from "../types.ts"
import * as Schedule from "effect/Schedule"
import * as Cause from "effect/Cause"
import * as ServiceMap from "effect/ServiceMap"
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

export class DiscordWSCodec extends ServiceMap.Service<
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
        closeCodeIsError: _ => true,
        openTimeout: 5000,
      })
      const writeRaw = yield* socket.writer
      const logWriteError = (cause: Cause.Cause<Socket.SocketError>) =>
        Effect.annotateLogs(Effect.logDebug(cause), {
          module: "DiscordGateway/DiscordWS",
          channel: "outbound",
        })
      const write = (message: MessageSend): Effect.Effect<void> => {
        if (message === Reconnect) {
          return Effect.catchCause(
            writeRaw(new Socket.CloseEvent(3000, "reconnecting")),
            logWriteError,
          )
        }
        return Effect.catchCause(
          writeRaw(encoding.encode(message)),
          logWriteError,
        )
      }
      const traceEnabled = LogLevel.isLessThanOrEqualTo(
        yield* MinimumLogLevel,
        "Trace",
      )
      const loggers = yield* CurrentLoggers
      yield* onConnecting.pipe(
        Effect.andThen(
          Effect.withFiber<void, Socket.SocketError>(fiber =>
            socket.runRaw(_ => {
              const message = encoding.decode(_)
              Queue.offerUnsafe(messages, message)
              if (!traceEnabled) return
              loggers.forEach(logger => {
                logger.log({
                  message,
                  cause: Cause.empty,
                  fiber,
                  logLevel: "Trace",
                  date: new Date(),
                })
              })
            }),
          ),
        ),
        Effect.retry({
          while: e =>
            e.reason._tag === "SocketCloseError" && e.reason.code === 3000,
        }),
        Effect.catchCause(cause =>
          Effect.logDebug("Got socket error, reconnecting", cause),
        ),
        Effect.repeat(
          Schedule.exponential(500).pipe(
            Schedule.either(Schedule.spaced(10000)),
          ),
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

export class DiscordWS extends ServiceMap.Service<
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
