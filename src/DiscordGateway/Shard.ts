import { DiscordConfig } from "../DiscordConfig.ts"
import type { MessageSend } from "./DiscordWS.ts"
import { DiscordWS, DiscordWSLive, Reconnect } from "./DiscordWS.ts"
import { Messaging, MesssagingLive } from "./Messaging.ts"
import type { ShardState } from "./Shard/StateStore.ts"
import { ShardStateStore } from "./Shard/StateStore.ts"
import { DispatchHook } from "./Shard/DispatchHook.ts"
import * as Heartbeats from "./Shard/heartbeats.ts"
import * as Identify from "./Shard/identify.ts"
import { RateLimiter, RateLimiterLive } from "../RateLimit.ts"
import * as Discord from "../types.ts"
import * as Duration from "effect/Duration"
import * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Redacted from "effect/Redacted"
import type * as Types from "effect/Types"
import * as FiberHandle from "effect/FiberHandle"
import { constant, constTrue, constVoid } from "effect/Function"
import * as Queue from "effect/Queue"
import * as Context from "effect/Context"
import * as PubSub from "effect/PubSub"
import * as LogLevel from "effect/LogLevel"
import { MinimumLogLevel } from "effect/References"

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
  const onDispatch = yield* DispatchHook

  const connect = Effect.fnUntraced(
    function* (shard: [id: number, count: number]) {
      const traceEnabled = LogLevel.isLessThanOrEqualTo(
        yield* MinimumLogLevel,
        "Trace",
      )
      const reconnectHandle = yield* FiberHandle.make()
      let phase = Phase.Connecting
      const stateStore = shardState.forShard(shard)
      const storedState = yield* stateStore.get
      // copy, so READY doesn't change a stored object before it is committed
      const resumeState: Types.Mutable<ShardState> = Option.match(storedState, {
        onNone: () => ({ resumeUrl: "", sessionId: "", sequence: 0 }),
        onSome: state => ({ ...state }),
      })
      // heartbeats use the last sequence received, RESUME uses the last one
      // stored, which can lag behind while the dispatch hook runs
      let lastReceived = Option.getOrNull(
        Option.map(storedState, state => state.sequence),
      )
      // after a failed dispatch, frames from the old connection are skipped
      // so nothing is stored past the failed sequence
      let awaitingHello = false
      const setPhase = (p: Phase): Effect.Effect<void> =>
        Effect.suspend(() => {
          phase = p
          if (!traceEnabled) return Effect.void
          return Effect.annotateLogs(
            Effect.logTrace("phase transition"),
            "phase",
            p,
          )
        })

      const heartbeatSend = (p: MessageSend) =>
        Effect.suspend(() => {
          if (phase === Phase.Connecting) return Effect.void
          return write(p)
        })

      const resume = Effect.andThen(
        FiberHandle.clear(reconnectHandle),
        setPhase(Phase.Connected),
      )

      const onConnecting = setPhase(Phase.Connecting)

      const socket = yield* dws.connect({ onConnecting })
      const write = (p: MessageSend) =>
        Effect.andThen(
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
          socket.write(p),
        )

      const hellos = yield* Effect.acquireRelease(
        Queue.make<Discord.GatewayHelloData>(),
        Queue.shutdown,
      )
      const acks = yield* Effect.acquireRelease(
        Queue.make<void>(),
        Queue.shutdown,
      )

      // heartbeats
      yield* Heartbeats.send(
        hellos,
        acks,
        Effect.sync(() => lastReceived),
        heartbeatSend,
      ).pipe(Effect.forkScoped, Effect.interruptible)

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

      // pass a copy, so stores that keep the object don't see later changes
      const commit = (sequence: number) =>
        Effect.uninterruptible(
          Effect.suspend(() => {
            resumeState.sequence = sequence
            return stateStore.set({ ...resumeState })
          }),
        )

      function* onPayload(p: Discord.GatewayReceivePayload) {
        if (awaitingHello) {
          if (p.op !== Discord.GatewayOpcodes.Hello) return
          awaitingHello = false
        }
        if (typeof p.s === "number") {
          lastReceived = p.s
        }

        switch (p.op) {
          case Discord.GatewayOpcodes.Hello: {
            yield* write(yield* identify)
            yield* setPhase(Phase.Handshake)
            Queue.offerUnsafe(hellos, p.d)
            yield* FiberHandle.run(reconnectHandle, delayedReconnect)
            return
          }
          case Discord.GatewayOpcodes.HeartbeatAck: {
            Queue.offerUnsafe(acks, void 0)
            return
          }
          case Discord.GatewayOpcodes.InvalidSession: {
            if (!p.d) {
              resumeState.sessionId = ""
              lastReceived = null
              yield* stateStore.clear
            }
            yield* socket.write(Reconnect)
            return
          }
          case Discord.GatewayOpcodes.Dispatch: {
            if (p.t === "READY") {
              resumeState.sessionId = p.d.session_id
              resumeState.resumeUrl = p.d.resume_gateway_url
            }
            yield* onDispatch(p, { shard, sessionId: resumeState.sessionId })
            if (resumeState.sessionId !== "" && resumeState.resumeUrl !== "") {
              yield* commit(p.s)
            }
            if (p.t === "READY") {
              yield* socket.setUrl(p.d.resume_gateway_url)
            }
            if (p.t === "READY" || p.t === "RESUMED") {
              yield* resume
            }
            PubSub.publishUnsafe(hub, p)
            return
          }
          case Discord.GatewayOpcodes.Reconnect: {
            yield* socket.write(Reconnect)
            return
          }
        }
      }

      yield* Effect.whileLoop({
        while: constTrue,
        body: constant(Effect.flatMap(Queue.take(sendMailbox), write)),
        step: constVoid,
      }).pipe(Effect.forkScoped)

      // a failed dispatch drops the connection, so it resumes from the last
      // stored sequence instead of leaving the shard half alive
      yield* Effect.gen(function* () {
        while (true) {
          yield* onPayload(yield* socket.take)
        }
      }).pipe(
        Effect.catchCause(cause => {
          if (Cause.hasInterruptsOnly(cause)) return Effect.failCause(cause)
          awaitingHello = true
          return Effect.andThen(
            Effect.logError("Failed to handle payload, reconnecting", cause),
            socket.write(Reconnect),
          )
        }),
        Effect.forever,
        Effect.forkScoped,
      )

      return { id: shard, write } as const
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

type ShardService = Effect.Success<typeof make>

export class Shard extends Context.Service<Shard, ShardService>()(
  "dfx/DiscordGateway/Shard",
) {}
export const ShardLive = Layer.effect(Shard, make).pipe(
  Layer.provide(DiscordWSLive),
  Layer.provide(MesssagingLive),
  Layer.provide(RateLimiterLive),
)

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RunningShard extends Effect.Success<
  ReturnType<ShardService["connect"]>
> {}
