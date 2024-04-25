import * as Chunk from "effect/Chunk"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"
import * as Secret from "effect/Secret"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import { DiscordConfig } from "dfx/DiscordConfig"
import type { Message } from "dfx/DiscordGateway/DiscordWS"
import {
  DiscordWS,
  DiscordWSLive,
  Reconnect,
} from "dfx/DiscordGateway/DiscordWS"
import * as Heartbeats from "dfx/DiscordGateway/Shard/heartbeats"
import * as Identify from "dfx/DiscordGateway/Shard/identify"
import * as InvalidSession from "dfx/DiscordGateway/Shard/invalidSession"
import * as Utils from "dfx/DiscordGateway/Shard/utils"
import { RateLimiterLive, RateLimiter } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import { Messaging, MesssagingLive } from "dfx/DiscordGateway/Messaging"

const enum Phase {
  Connecting,
  Handshake,
  Connected,
}

export const make = Effect.gen(function* () {
  const { gateway, token } = yield* DiscordConfig
  const limiter = yield* RateLimiter
  const dws = yield* DiscordWS
  const { hub, sendQueue } = yield* Messaging

  const connect = (shard: [id: number, count: number]) =>
    Effect.gen(function* () {
      const outboundQueue = yield* Queue.unbounded<Message>()
      const pendingQueue = yield* Queue.unbounded<Message>()
      const phase = yield* Ref.make(Phase.Connecting)
      const setPhase = (p: Phase) =>
        Effect.zipLeft(
          Ref.set(phase, p),
          Effect.annotateLogs(Effect.logTrace("phase transition"), "phase", p),
        )
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
        Effect.asVoid,
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

      const socket = yield* dws.connect({ outbound, onConnecting })

      const isReady = Option.liftPredicate(
        (
          p: Discord.GatewayPayload,
        ): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
          p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
      )

      const [latestReady, updateLatestReady] = yield* Utils.latest(p =>
        Option.map(isReady(p), p => p.d!),
      )
      const [latestSequence, updateLatestSequence] = yield* Utils.latest(p =>
        Option.fromNullable(p.s),
      )
      const maybeUpdateUrl = (p: Discord.GatewayPayload) =>
        Option.match(
          Option.map(isReady(p), p => p.d!),
          {
            onNone: () => Effect.void,
            onSome: ({ resume_gateway_url }) =>
              socket.setUrl(resume_gateway_url),
          },
        )

      const hellos = yield* Effect.acquireRelease(
        Queue.unbounded<Discord.GatewayPayload>(),
        Queue.shutdown,
      )
      const acks = yield* Effect.acquireRelease(
        Queue.unbounded<Discord.GatewayPayload>(),
        Queue.shutdown,
      )

      // heartbeats
      yield Heartbeats.send(hellos, acks, latestSequence, heartbeatSend).pipe(
        Effect.forkScoped,
        Effect.interruptible,
      )

      // identify
      const identify = Identify.identifyOrResume(
        {
          token: Secret.value(token),
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
              case Discord.GatewayOpcode.HELLO: {
                return pipe(
                  Effect.tap(identify, prioritySend),
                  Effect.zipRight(setPhase(Phase.Handshake)),
                  Effect.zipRight(Queue.offer(hellos, p)),
                )
              }
              case Discord.GatewayOpcode.HEARTBEAT_ACK: {
                return Queue.offer(acks, p)
              }
              case Discord.GatewayOpcode.INVALID_SESSION: {
                return Effect.tap(
                  InvalidSession.fromPayload(p, latestReady),
                  send,
                )
              }
              case Discord.GatewayOpcode.DISPATCH: {
                if (p.t === "READY" || p.t === "RESUMED") {
                  return Effect.zipRight(resume, PubSub.publish(hub, p))
                }
                return PubSub.publish(hub, p)
              }
              case Discord.GatewayOpcode.RECONNECT: {
                return prioritySend(Reconnect)
              }
              default: {
                return Effect.void
              }
            }
          }),
        )

      yield Queue.take(sendQueue).pipe(
        Effect.tap(send),
        Effect.forever,
        Effect.forkScoped,
        Effect.interruptible,
      )

      yield socket.take.pipe(
        Effect.flatMap(onPayload),
        Effect.forever,
        Effect.forkScoped,
        Effect.interruptible,
      )

      return { id: shard, send } as const
    }).pipe(
      Effect.annotateLogs({
        package: "dfx",
        module: "DiscordGateway/Shard",
        shard,
      }),
    )

  return { connect } as const
})

type ShardService = Effect.Effect.Success<typeof make>

export interface Shard {
  readonly _: unique symbol
}
export const Shard = GenericTag<Shard, ShardService>("dfx/DiscordGateway/Shard")
export const ShardLive = Layer.effect(Shard, make).pipe(
  Layer.provide(DiscordWSLive),
  Layer.provide(MesssagingLive),
  Layer.provide(RateLimiterLive),
)

export interface RunningShard
  extends Effect.Effect.Success<ReturnType<ShardService["connect"]>> {}
