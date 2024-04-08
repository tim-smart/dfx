import { GenericTag } from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Ref from "effect/Ref"
import type * as Discord from "dfx/types"
import * as Socket from "@effect/platform/Socket"
import * as Queue from "effect/Queue"
import * as Schedule from "effect/Schedule"

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

export const DiscordWSCodec = GenericTag<DiscordWSCodec, DiscordWSCodecService>(
  "dfx/DiscordGateway/DiscordWS/Codec",
)
export const JsonDiscordWSCodecLive = Layer.succeed(DiscordWSCodec, {
  type: "json",
  encode: p => JSON.stringify(p),
  decode: p => JSON.parse(typeof p === "string" ? p : decoder.decode(p)),
})

const make = Effect.gen(function* (_) {
  const encoding = yield* _(DiscordWSCodec)

  const connect = ({
    onConnecting,
    outbound,
    url = "wss://gateway.discord.gg/",
    version = 10,
  }: OpenOpts) =>
    Effect.gen(function* (_) {
      const urlRef = yield* _(
        Ref.make(`${url}?v=${version}&encoding=${encoding.type}`),
      )
      const setUrl = (url: string) =>
        Ref.set(urlRef, `${url}?v=${version}&encoding=${encoding.type}`)
      const messages = yield* _(Queue.unbounded<Discord.GatewayPayload>())
      const socket = yield* _(
        Socket.makeWebSocket(Ref.get(urlRef), {
          closeCodeIsError: _ => true,
          openTimeout: 5000,
        }),
      )
      const write = yield* _(socket.writer)
      yield* _(
        outbound,
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
      yield* _(
        onConnecting,
        Effect.zipRight(
          socket.runRaw(_ => {
            const message = encoding.decode(_)
            return Effect.zipRight(
              Effect.logTrace(message),
              messages.offer(message),
            )
          }),
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
        take: Queue.take(messages),
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
