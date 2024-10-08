import { GenericTag } from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import type * as Discord from "dfx/types"
import * as Socket from "@effect/platform/Socket"
import * as Mailbox from "effect/Mailbox"
import * as Schedule from "effect/Schedule"
import * as Cause from "effect/Cause"
import * as Option from "effect/Option"
import * as LogLevel from "effect/LogLevel"

export type Message = Discord.GatewayPayload | Reconnect

export const Reconnect = Symbol.for("dfx/DiscordGateway/WS/Reconnect")
export type Reconnect = typeof Reconnect

export interface OpenOpts {
  url?: string
  version?: number
  encoding?: DiscordWSCodec
  outbound: Effect.Effect<Message>
  onConnecting: Effect.Effect<void>
}

export interface DiscordWSCodecService {
  type: "json" | "etf"
  encode: (p: Discord.GatewayPayload) => Uint8Array | string
  decode: (p: Uint8Array | string) => Discord.GatewayPayload
}
export interface DiscordWSCodec {
  readonly _: unique symbol
}

const decoder = new TextDecoder()
const logLevelDebug = Option.some(LogLevel.Debug)

export const DiscordWSCodec = GenericTag<DiscordWSCodec, DiscordWSCodecService>(
  "dfx/DiscordGateway/DiscordWS/Codec",
)
export const JsonDiscordWSCodecLive = Layer.succeed(DiscordWSCodec, {
  type: "json",
  encode: p => JSON.stringify(p),
  decode: p => JSON.parse(typeof p === "string" ? p : decoder.decode(p)),
})

const make = Effect.gen(function* () {
  const encoding = yield* DiscordWSCodec

  const connect = ({
    onConnecting,
    outbound,
    url = "wss://gateway.discord.gg/",
    version = 10,
  }: OpenOpts) =>
    Effect.gen(function* () {
      const urlRef = yield* Ref.make(
        `${url}?v=${version}&encoding=${encoding.type}`,
      )
      const setUrl = (url: string) =>
        Ref.set(urlRef, `${url}?v=${version}&encoding=${encoding.type}`)
      const messages = yield* Mailbox.make<Discord.GatewayPayload>()
      const socket = yield* Socket.makeWebSocket(Ref.get(urlRef), {
        closeCodeIsError: _ => true,
        openTimeout: 5000,
      })
      const write = yield* socket.writer
      yield* outbound.pipe(
        Effect.flatMap(_ => {
          if (_ === Reconnect) {
            return Effect.zipRight(
              Effect.logTrace("Reconnecting"),
              write(new Socket.CloseEvent(1012, "reconnecting")),
            )
          }
          return Effect.zipRight(Effect.logTrace(_), write(encoding.encode(_)))
        }),
        Effect.forever,
        Effect.annotateLogs("channel", "outbound"),
        Effect.forkScoped,
        Effect.interruptible,
      )
      yield* onConnecting.pipe(
        Effect.zipRight(
          Effect.withFiberRuntime<void, Socket.SocketError>(fiber =>
            socket.runRaw(_ => {
              const message = encoding.decode(_)
              messages.unsafeOffer(message)
              ;(fiber as any).log([message], Cause.empty, logLevelDebug)
            }),
          ),
        ),
        Effect.retry({
          while: e => e.reason === "Close" && e.code === 1012,
        }),
        Effect.catchAllCause(cause =>
          Effect.logDebug("Got socket error, reconnecting", cause),
        ),
        Effect.repeat(
          Schedule.exponential(500).pipe(
            Schedule.union(Schedule.spaced(10000)),
          ),
        ),
        Effect.annotateLogs("channel", "inbound"),
        Effect.forkScoped,
        Effect.interruptible,
      )

      return {
        take: messages.take,
        setUrl,
      } as const
    }).pipe(
      Effect.annotateLogs({
        module: "DiscordGateway/DiscordWS",
      }),
    )

  return { connect } as const
})

export interface DiscordWS {
  readonly _: unique symbol
}
export const DiscordWS = GenericTag<
  DiscordWS,
  Effect.Effect.Success<typeof make>
>("dfx/DiscordGateway/DiscordWS")
export const DiscordWSLive = Layer.effect(DiscordWS, make)
