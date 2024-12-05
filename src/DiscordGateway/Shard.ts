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
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Mailbox from "effect/Mailbox"
import * as Redacted from "effect/Redacted"
import * as Ref from "effect/Ref"
import type * as Types from "effect/Types"
import { genFn } from "dfx/utils/Effect"
import * as FiberHandle from "effect/FiberHandle"

const enum Phase {
  Connecting,
  Handshake,
  Connected,
}

export const make = Effect.gen(function* () {
  const { gateway, token } = yield* DiscordConfig
  const limiter = yield* RateLimiter
  const dws = yield* DiscordWS
  const { hub, sendMailbox } = yield* Messaging
  const shardState = yield* ShardStateStore

  const connect = (shard: [id: number, count: number]) =>
    Effect.gen(function* (_) {
      const outboundQueue = yield* Mailbox.make<Message>()
      const pendingQueue = yield* Mailbox.make<Message>()
      const reconnectHandle = yield* FiberHandle.make()
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
      const outbound = Effect.orDie(
        Effect.zipLeft(
          outboundQueue.take,
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
        ),
      )

      function* send(p: Message) {
        if ((yield* Ref.get(phase)) === Phase.Connected) {
          outboundQueue.unsafeOffer(p)
        } else {
          pendingQueue.unsafeOffer(p)
        }
      }

      const heartbeatSend = genFn(function* (p: Message) {
        if ((yield* Ref.get(phase)) !== Phase.Connecting) {
          outboundQueue.unsafeOffer(p)
          return true
        }
        return false
      })

      const prioritySend = (p: Message) => outboundQueue.offer(p)

      const resume = Effect.gen(function* () {
        yield* FiberHandle.clear(reconnectHandle)
        yield* setPhase(Phase.Connected)
        const msgs = yield* pendingQueue.clear
        outboundQueue.unsafeOfferAll(
          Chunk.filter(
            msgs,
            msg =>
              msg !== Reconnect &&
              msg.op !== Discord.GatewayOpcode.IDENTIFY &&
              msg.op !== Discord.GatewayOpcode.RESUME &&
              msg.op !== Discord.GatewayOpcode.HEARTBEAT,
          ),
        )
      })

      const onConnecting = Effect.gen(function* () {
        const msgs = yield* outboundQueue.clear
        pendingQueue.unsafeOfferAll(
          Chunk.filter(
            msgs,
            msg =>
              msg !== Reconnect &&
              msg.op !== Discord.GatewayOpcode.IDENTIFY &&
              msg.op !== Discord.GatewayOpcode.RESUME &&
              msg.op !== Discord.GatewayOpcode.HEARTBEAT,
          ),
        )
        yield* setPhase(Phase.Connecting)
      })

      const socket = yield* dws.connect({ outbound, onConnecting })

      const hellos = yield* Effect.acquireRelease(
        Mailbox.make<Discord.GatewayPayload>(),
        _ => _.shutdown,
      )
      const acks = yield* Effect.acquireRelease(
        Mailbox.make<Discord.GatewayPayload>(),
        _ => _.shutdown,
      )

      // heartbeats
      yield* Heartbeats.send(hellos, acks, stateStore.get, heartbeatSend).pipe(
        Effect.forkScoped,
        Effect.interruptible,
      )

      // identify
      const identify = Identify.identifyOrResume(
        {
          token: Redacted.value(token),
          shard,
          intents: gateway.intents,
          presence: gateway.presence,
        },
        stateStore.get,
      )

      // delayed reconnect
      const delayedReconnect = Effect.gen(function* () {
        yield* Effect.sleep(30_000)
        yield* prioritySend(Reconnect)
      })

      function* onPayload(p: Discord.GatewayPayload) {
        if (typeof p.s === "number") {
          resumeState.sequence = p.s
        }
        if (p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY") {
          const payload = p.d as Discord.ReadyEvent
          resumeState.sessionId = payload.session_id
          resumeState.resumeUrl = payload.resume_gateway_url
          yield* stateStore.set(resumeState)
          yield* socket.setUrl(payload.resume_gateway_url)
        } else if (
          resumeState.resumeUrl !== "" &&
          resumeState.sessionId !== ""
        ) {
          yield* stateStore.set(resumeState)
        }

        switch (p.op) {
          case Discord.GatewayOpcode.HELLO: {
            yield* prioritySend(yield* identify)
            yield* setPhase(Phase.Handshake)
            hellos.unsafeOffer(p)
            yield* FiberHandle.run(reconnectHandle, delayedReconnect)
            break
          }
          case Discord.GatewayOpcode.HEARTBEAT_ACK: {
            acks.unsafeOffer(p)
            break
          }
          case Discord.GatewayOpcode.INVALID_SESSION: {
            if (!p.d) {
              resumeState.sessionId = ""
              yield* stateStore.clear
            }
            yield* send(Reconnect)
            break
          }
          case Discord.GatewayOpcode.DISPATCH: {
            if (p.t === "READY" || p.t === "RESUMED") {
              yield* resume
            }
            hub.unsafeOffer(p)
            break
          }
          case Discord.GatewayOpcode.RECONNECT: {
            yield* prioritySend(Reconnect)
            break
          }
        }
      }

      yield* Effect.gen(function* () {
        while (true) {
          yield* send(yield* sendMailbox.take)
        }
      }).pipe(Effect.forkScoped, Effect.interruptible)

      yield* Effect.gen(function* () {
        while (true) {
          yield* onPayload(yield* socket.take)
        }
      }).pipe(Effect.forkScoped, Effect.interruptible)

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RunningShard
  extends Effect.Effect.Success<ReturnType<ShardService["connect"]>> {}
