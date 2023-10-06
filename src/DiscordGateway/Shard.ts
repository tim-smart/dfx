import * as Chunk from "effect/Chunk"
import { Tag } from "effect/Context"
import * as Duration from "effect/Duration"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"
import * as ConfigSecret from "effect/ConfigSecret"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
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
    hub: PubSub.PubSub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
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

      const resume = pipe(
        setPhase(Phase.Connected),
        Effect.zipRight(Queue.takeAll(pendingQueue)),
        Effect.tap(_ => Queue.offerAll(outboundQueue, _)),
        Effect.asUnit,
      )

      const onConnecting = pipe(
        Queue.takeAll(outboundQueue),
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

      const isReady = Option.liftPredicate(
        (
          p: Discord.GatewayPayload,
        ): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
          p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
      )

      const [latestReady, updateLatestReady] = yield* _(
        Utils.latest(p => Option.map(isReady(p), p => p.d!)),
      )
      const [latestSequence, updateLatestSequence] = yield* _(
        Utils.latest(p => Option.fromNullable(p.s)),
      )
      const maybeUpdateUrl = (p: Discord.GatewayPayload) =>
        Option.match(
          Option.map(isReady(p), p => p.d!),
          {
            onNone: () => Effect.unit,
            onSome: ({ resume_gateway_url }) =>
              socket.setUrl(resume_gateway_url),
          },
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
        pipe(
          updateLatestReady(p),
          Effect.zipRight(updateLatestSequence(p)),
          Effect.zipRight(maybeUpdateUrl(p)),
          Effect.tap(() => {
            switch (p.op) {
              case Discord.GatewayOpcode.HELLO:
                return pipe(
                  Effect.tap(identify, prioritySend),
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
                  return Effect.zipRight(resume, PubSub.publish(hub, p))
                }
                return PubSub.publish(hub, p)
              default:
                return Effect.unit
            }
          }),
        )

      const drainSendQueue = Effect.forever(
        Effect.tap(Queue.take(sendQueue), send),
      )

      const run = Effect.all(
        [
          Effect.forever(Effect.flatMap(socket.take, onPayload)),
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
