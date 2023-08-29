import * as Chunk from "@effect/data/Chunk"
import { Tag } from "@effect/data/Context"
import * as Duration from "@effect/data/Duration"
import * as Option from "@effect/data/Option"
import * as ConfigSecret from "@effect/io/Config/Secret"
import * as Effect from "@effect/io/Effect"
import * as Hub from "@effect/io/Hub"
import * as Layer from "@effect/io/Layer"
import * as Queue from "@effect/io/Queue"
import * as Ref from "@effect/io/Ref"
import { DiscordConfig } from "dfx/DiscordConfig"
import type { Message } from "dfx/DiscordGateway/DiscordWS"
import { DiscordWS, LiveDiscordWS } from "dfx/DiscordGateway/DiscordWS"
import * as Heartbeats from "dfx/DiscordGateway/Shard/heartbeats"
import * as Identify from "dfx/DiscordGateway/Shard/identify"
import * as InvalidSession from "dfx/DiscordGateway/Shard/invalidSession"
import * as Utils from "dfx/DiscordGateway/Shard/utils"
import { Reconnect } from "dfx/DiscordGateway/WS"
import { Log } from "dfx/Log"
import { LiveRateLimiter, RateLimiter } from "dfx/RateLimit"
import * as Discord from "dfx/types"

const enum Phase {
  Connecting,
  Handshake,
  Connected,
}

export const make = Effect.gen(function* (_) {
  const { gateway, token } = yield* _(DiscordConfig)
  const limiter = yield* _(RateLimiter)
  const dws = yield* _(DiscordWS)
  const log = yield* _(Log)

  const connect = (
    shard: [id: number, count: number],
    hub: Hub.Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
    sendQueue: Queue.Dequeue<Discord.GatewayPayload<Discord.SendEvent>>,
  ) =>
    Effect.gen(function* (_) {
      const outboundQueue = yield* _(Queue.unbounded<Message>())
      const pendingQueue = yield* _(Queue.unbounded<Message>())
      const phase = yield* _(Ref.make(Phase.Connecting))
      const setPhase = (p: Phase) =>
        Effect.zipLeft(Ref.set(phase, p), log.debug("Shard", shard, "phase", p))
      const outbound = Effect.zipLeft(
        Queue.take(outboundQueue),
        limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
      )

      const send = (p: Message) =>
        Effect.flatMap(Ref.get(phase), phase =>
          phase === Phase.Connected
            ? Queue.offer(outboundQueue, p)
            : Queue.offer(pendingQueue, p),
        )

      const heartbeatSend = (p: Message) =>
        Effect.flatMap(Ref.get(phase), phase =>
          phase !== Phase.Connecting
            ? Queue.offer(outboundQueue, p)
            : Effect.succeed(false),
        )

      const prioritySend = (p: Message) => Queue.offer(outboundQueue, p)

      const resume = setPhase(Phase.Connected).pipe(
        Effect.zipRight(Queue.takeAll(pendingQueue)),
        Effect.tap(_ => Queue.offerAll(outboundQueue, _)),
        Effect.asUnit,
      )

      const onConnecting = Queue.takeAll(outboundQueue).pipe(
        Effect.tap(msgs =>
          Queue.offerAll(
            pendingQueue,
            Chunk.filter(
              msgs,
              msg =>
                msg !== Reconnect &&
                msg.op !== Discord.GatewayOpcode.IDENTIFY &&
                msg.op !== Discord.GatewayOpcode.RESUME &&
                msg.op !== Discord.GatewayOpcode.HEARTBEAT,
            ),
          ),
        ),
        Effect.zipRight(setPhase(Phase.Connecting)),
      )

      const socket = yield* _(dws.connect({ outbound, onConnecting }))

      const [latestReady, updateLatestReady] = yield* _(
        Utils.latest(p =>
          Option.some(p).pipe(
            Option.filter(
              (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
                p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
            ),
            Option.map(p => p.d!),
          ),
        ),
      )
      const [latestSequence, updateLatestSequence] = yield* _(
        Utils.latest(p => Option.fromNullable(p.s)),
      )
      const maybeUpdateUrl = (p: Discord.GatewayPayload) =>
        Option.some(p).pipe(
          Option.filter(
            (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
              p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
          ),
          Option.map(p => p.d!),
          Option.match({
            onNone: () => Effect.unit,
            onSome: ({ resume_gateway_url }) =>
              socket.setUrl(resume_gateway_url),
          }),
        )

      const hellos = yield* _(Queue.unbounded<Discord.GatewayPayload>())
      const acks = yield* _(Queue.unbounded<Discord.GatewayPayload>())

      // heartbeats
      const heartbeats = Heartbeats.send(
        hellos,
        acks,
        latestSequence,
        heartbeatSend,
      )

      // identify
      const identify = Identify.identifyOrResume(
        {
          token: ConfigSecret.value(token),
          shard,
          intents: gateway.intents,
          presence: gateway.presence,
        },
        latestReady,
        latestSequence,
      )

      const onPayload = (p: Discord.GatewayPayload) =>
        updateLatestReady(p).pipe(
          Effect.zipRight(updateLatestSequence(p)),
          Effect.zipRight(maybeUpdateUrl(p)),
          Effect.tap(() => {
            switch (p.op) {
              case Discord.GatewayOpcode.HELLO:
                return Effect.tap(identify, prioritySend).pipe(
                  Effect.zipRight(setPhase(Phase.Handshake)),
                  Effect.zipRight(Queue.offer(hellos, p)),
                )
              case Discord.GatewayOpcode.HEARTBEAT_ACK:
                return Queue.offer(acks, p)
              case Discord.GatewayOpcode.INVALID_SESSION:
                return Effect.tap(
                  InvalidSession.fromPayload(p, latestReady),
                  send,
                )
              case Discord.GatewayOpcode.DISPATCH:
                if (p.t === "READY" || p.t === "RESUMED") {
                  return Effect.zipRight(resume, Hub.publish(hub, p))
                }
                return Hub.publish(hub, p)
            }

            return Effect.unit
          }),
        )

      const drainSendQueue = Queue.take(sendQueue).pipe(
        Effect.tap(send),
        Effect.forever,
      )

      const run = Effect.all(
        [
          socket.take.pipe(Effect.flatMap(onPayload), Effect.forever),
          heartbeats,
          drainSendQueue,
          socket.run,
        ],
        { discard: true, concurrency: "unbounded" },
      )

      return { id: shard, send, run } as const
    })

  return { connect } as const
})

export interface Shard extends Effect.Effect.Success<typeof make> {}
export const Shard = Tag<Shard>()
export const LiveShard = Layer.provide(
  Layer.merge(LiveDiscordWS, LiveRateLimiter),
  Layer.effect(Shard, make),
)

export interface RunningShard
  extends Effect.Effect.Success<ReturnType<Shard["connect"]>> {}
