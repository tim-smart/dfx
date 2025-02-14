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
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Mailbox from "effect/Mailbox"
import * as Redacted from "effect/Redacted"
import type * as Types from "effect/Types"
import * as FiberHandle from "effect/FiberHandle"
import { constant, constTrue, constVoid } from "effect/Function"

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

  const connect = Effect.fnUntraced(
    function* (shard: [id: number, count: number]) {
      const reconnectHandle = yield* FiberHandle.make()
      let phase = Phase.Connecting
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
        Effect.suspend(() => {
          phase = p
          return Effect.annotateLogs(
            Effect.logTrace("phase transition"),
            "phase",
            p,
          )
        })

      const heartbeatSend = (p: Message) =>
        Effect.suspend(() => {
          if (phase === Phase.Connecting) return Effect.void
          return write(p)
        })

      const resume = Effect.zipRight(
        FiberHandle.clear(reconnectHandle),
        setPhase(Phase.Connected),
      )

      const onConnecting = setPhase(Phase.Connecting)

      const socket = yield* dws.connect({ onConnecting })
      const write = (p: Message) =>
        Effect.zipRight(
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
          socket.write(p),
        )

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
      const delayedReconnect = Effect.delay(socket.write(Reconnect), 30_000)

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
            yield* write(yield* identify)
            yield* setPhase(Phase.Handshake)
            hellos.unsafeOffer(p)
            yield* FiberHandle.run(reconnectHandle, delayedReconnect)
            return
          }
          case Discord.GatewayOpcode.HEARTBEAT_ACK: {
            acks.unsafeOffer(p)
            return
          }
          case Discord.GatewayOpcode.INVALID_SESSION: {
            if (!p.d) {
              resumeState.sessionId = ""
              yield* stateStore.clear
            }
            yield* socket.write(Reconnect)
            return
          }
          case Discord.GatewayOpcode.DISPATCH: {
            if (p.t === "READY" || p.t === "RESUMED") {
              yield* resume
            }
            hub.unsafeOffer(p)
            return
          }
          case Discord.GatewayOpcode.RECONNECT: {
            yield* socket.write(Reconnect)
            return
          }
        }
      }

      yield* Effect.whileLoop({
        while: constTrue,
        body: constant(Effect.flatMap(sendMailbox.take, write)),
        step: constVoid,
      }).pipe(Effect.forkScoped, Effect.interruptible)

      yield* Effect.gen(function* () {
        while (true) {
          yield* onPayload(yield* socket.take)
        }
      }).pipe(Effect.forkScoped, Effect.interruptible)

      return { id: shard } as const
    },
    (effect, shard) =>
      Effect.annotateLogs(effect, {
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
