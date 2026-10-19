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
import * as Deferred from "effect/Deferred"
import * as Clock from "effect/Clock"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Redacted from "effect/Redacted"
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

const noSession: ShardState = { resumeUrl: "", sessionId: "", sequence: 0 }

// after consecutive handling failures, wait 1s, 2s, 4s ... up to 2 minutes
// before the next IDENTIFY or RESUME
const retryDelay = (failures: number) =>
  Math.min(1000 * 2 ** (failures - 1), 120_000)

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
      const stored = Option.getOrUndefined(yield* stateStore.get)
      // the state committed for RESUME, never mutated so stores may keep it
      let resumeState: ShardState = stored ?? noSession
      // heartbeats report the last sequence received, which runs ahead of
      // `resumeState.sequence` while the dispatch hook runs
      let lastReceived: number | null = stored?.sequence ?? null
      // consecutive handling failures, and the time before which no
      // handshake is sent; kept across sockets so no reconnect skips the wait
      let failures = 0
      let retryAt = 0
      // completes once IDENTIFY or RESUME is sent on the current socket
      let handshakeSent = Deferred.makeUnsafe<void>()
      Deferred.doneUnsafe(handshakeSent, Effect.void)
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

      // a new socket drops any handshake still pending on the old one
      const onConnecting = Effect.andThen(
        FiberHandle.clear(reconnectHandle),
        setPhase(Phase.Connecting),
      )

      const socket = yield* dws.connect({ onConnecting })
      const write = (p: MessageSend) =>
        Effect.andThen(
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
          socket.write(p),
        )
      const reconnect = Effect.andThen(
        setPhase(Phase.Connecting),
        socket.write(Reconnect),
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

      // waits out any failure backoff, then identifies or resumes and
      // reconnects if the handshake doesn't complete within 30s
      const handshake = (sent: Deferred.Deferred<void>) =>
        Effect.gen(function* () {
          const wait = retryAt - (yield* Clock.currentTimeMillis)
          if (wait > 0) yield* Effect.sleep(wait)
          yield* write(yield* identify)
        }).pipe(
          Effect.ensuring(Deferred.succeed(sent, void 0)),
          Effect.andThen(Effect.delay(reconnect, 30_000)),
        )

      // uninterruptible, so a shutdown after the hook completes still stores
      // the sequence and the dispatch is not replayed
      const commit = (state: ShardState) =>
        Effect.uninterruptible(
          Effect.suspend(() => {
            resumeState = state
            return Effect.andThen(
              stateStore.set(state),
              Effect.sync(() => {
                failures = 0
              }),
            )
          }),
        )

      function* onPayload(p: Discord.GatewayReceivePayload) {
        // until HELLO, anything still queued is from the previous socket
        if (
          phase === Phase.Connecting &&
          p.op !== Discord.GatewayOpcodes.Hello
        ) {
          return
        }
        // only ACKs are expected before the handshake, so hold anything else
        // until it is sent, and drop it if the socket was replaced meanwhile
        if (
          p.op !== Discord.GatewayOpcodes.Hello &&
          p.op !== Discord.GatewayOpcodes.HeartbeatAck
        ) {
          yield* Deferred.await(handshakeSent)
          if (phase === Phase.Connecting) return
        }
        if (typeof p.s === "number") {
          lastReceived = p.s
        }

        switch (p.op) {
          case Discord.GatewayOpcodes.Hello: {
            yield* setPhase(Phase.Handshake)
            Queue.offerUnsafe(hellos, p.d)
            handshakeSent = Deferred.makeUnsafe<void>()
            yield* FiberHandle.run(reconnectHandle, handshake(handshakeSent))
            return
          }
          case Discord.GatewayOpcodes.HeartbeatAck: {
            Queue.offerUnsafe(acks, void 0)
            return
          }
          case Discord.GatewayOpcodes.InvalidSession: {
            if (!p.d) {
              resumeState = noSession
              lastReceived = null
              yield* stateStore.clear
            }
            yield* reconnect
            return
          }
          case Discord.GatewayOpcodes.Dispatch: {
            const next: ShardState =
              p.t === "READY"
                ? {
                    sessionId: p.d.session_id,
                    resumeUrl: p.d.resume_gateway_url,
                    sequence: p.s,
                  }
                : { ...resumeState, sequence: p.s }
            yield* onDispatch(p, { shard, sessionId: next.sessionId })
            if (next.sessionId !== "") {
              yield* commit(next)
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
            yield* reconnect
            return
          }
        }
      }

      yield* Effect.whileLoop({
        while: constTrue,
        body: constant(Effect.flatMap(Queue.take(sendMailbox), write)),
        step: constVoid,
      }).pipe(Effect.forkScoped)

      // a failure here drops the connection and resumes from the committed
      // sequence, instead of leaving heartbeats running with no reader
      yield* Effect.gen(function* () {
        while (true) {
          yield* onPayload(yield* socket.take)
        }
      }).pipe(
        Effect.catchCause(cause =>
          Cause.hasInterruptsOnly(cause)
            ? Effect.failCause(cause)
            : Effect.gen(function* () {
                failures++
                const delay = retryDelay(failures)
                retryAt = (yield* Clock.currentTimeMillis) + delay
                yield* Effect.logError(
                  `Failed to handle payload, reconnecting and waiting ${delay}ms before the handshake`,
                  cause,
                )
                yield* reconnect
              }),
        ),
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
