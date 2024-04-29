import { DiscordConfig } from "dfx/DiscordConfig"
import type { Message } from "dfx/DiscordGateway/DiscordWS"
import {
  DiscordWS,
  DiscordWSLive,
  Reconnect,
} from "dfx/DiscordGateway/DiscordWS"
import { Messaging, MesssagingLive } from "dfx/DiscordGateway/Messaging"
import type { ShardState } from "dfx/DiscordGateway/Shard/StateStore"
import { ShardStateStore } from "dfx/DiscordGateway/Shard/StateStore"
import * as Heartbeats from "dfx/DiscordGateway/Shard/heartbeats"
import * as Identify from "dfx/DiscordGateway/Shard/identify"
import { RateLimiter, RateLimiterLive } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import * as Chunk from "effect/Chunk"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import * as Secret from "effect/Secret"
import type * as Types from "effect/Types"

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
  const shardState = yield* ShardStateStore

  const connect = (shard: [id: number, count: number]) =>
    Effect.gen(function* (_) {
      const outboundQueue = yield* Queue.unbounded<Message>()
      const pendingQueue = yield* Queue.unbounded<Message>()
      const phase = yield* Ref.make(Phase.Connecting)
      const stateStore = shardState.forShard(shard)
      const resumeState: Types.Mutable<ShardState> = Option.getOrElse(
        yield* stateStore.get,
        () => ({
          resumeUrl: "",
          sessionId: "",
          sequence: 0,
        }),
      )
      const setPhase = (p: Phase): Effect.Effect<void> =>
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

      const hellos = yield* Effect.acquireRelease(
        Queue.unbounded<Discord.GatewayPayload>(),
        Queue.shutdown,
      )
      const acks = yield* Effect.acquireRelease(
        Queue.unbounded<Discord.GatewayPayload>(),
        Queue.shutdown,
      )

      // heartbeats
      yield* Heartbeats.send(hellos, acks, stateStore.get, heartbeatSend).pipe(
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
        stateStore.get,
      )

      const onPayload = (p: Discord.GatewayPayload) =>
        pipe(
          Effect.suspend(() => {
            if (typeof p.s === "number") {
              resumeState.sequence = p.s
            }
            if (p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY") {
              const payload = p.d as Discord.ReadyEvent
              resumeState.sessionId = payload.session_id
              resumeState.resumeUrl = payload.resume_gateway_url
              return Effect.zipRight(
                stateStore.set(resumeState),
                socket.setUrl(payload.resume_gateway_url),
              )
            }
            if (resumeState.resumeUrl !== "" && resumeState.sessionId !== "") {
              return stateStore.set(resumeState)
            }
            return Effect.void
          }),
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
                if (p.d) {
                  return send(Reconnect)
                }
                resumeState.sessionId = ""
                return Effect.zipRight(stateStore.clear, send(Reconnect))
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

      yield* Queue.take(sendQueue).pipe(
        Effect.tap(send),
        Effect.forever,
        Effect.forkScoped,
        Effect.interruptible,
      )

      yield* socket.take.pipe(
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
