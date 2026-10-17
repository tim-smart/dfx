import * as DiscordConfig from "dfx/DiscordConfig"
import type { MessageSend } from "dfx/DiscordGateway/DiscordWS"
import { DiscordWS, Reconnect } from "dfx/DiscordGateway/DiscordWS"
import { Messaging, MesssagingLive } from "dfx/DiscordGateway/Messaging"
import { make as makeShard, Shard } from "dfx/DiscordGateway/Shard"
import { DispatchHook } from "dfx/DiscordGateway/Shard/DispatchHook"
import type { ShardState } from "dfx/DiscordGateway/Shard/StateStore"
import { ShardStateStore } from "dfx/DiscordGateway/Shard/StateStore"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "dfx/RateLimit"
import * as Discord from "dfx/types"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as PubSub from "effect/PubSub"
import * as Queue from "effect/Queue"
import * as Redacted from "effect/Redacted"
import * as Scope from "effect/Scope"
import { WebSocketConstructor } from "effect/socket/Socket"
import * as TestClock from "effect/testing/TestClock"

export const shardId: [id: number, count: number] = [0, 1]
export const sessionId = "session-1"
const resumeUrl = "wss://resume.example"

export const hello = (heartbeat_interval: number) =>
  ({
    op: Discord.GatewayOpcodes.Hello,
    d: { heartbeat_interval },
    s: null,
    t: null,
  }) as Discord.GatewayReceivePayload

export const ready = (s: number) =>
  ({
    op: Discord.GatewayOpcodes.Dispatch,
    t: "READY",
    s,
    d: { session_id: sessionId, resume_gateway_url: resumeUrl },
  }) as unknown as Discord.GatewayReceivePayload

export const dispatch = (s: number) =>
  ({
    op: Discord.GatewayOpcodes.Dispatch,
    t: "MESSAGE_CREATE",
    s,
    d: {},
  }) as unknown as Discord.GatewayReceivePayload

export interface Event {
  readonly kind: "hook" | "set" | "publish"
  readonly seq: number | null
  readonly context?: unknown
}

export interface Harness {
  /** hook, store and subscriber activity, in the order it happened */
  readonly events: Array<Event>
  readonly written: Array<MessageSend>
  readonly receive: (
    ...frames: ReadonlyArray<Discord.GatewayReceivePayload>
  ) => Effect.Effect<void>
  /** completes when the sequence has reached a hub subscriber */
  readonly published: (seq: number) => Effect.Effect<void>
  /** completes when the shard writes `Reconnect` */
  readonly dropped: Effect.Effect<void>
  readonly firstHeartbeat: Effect.Effect<Discord.GatewayHeartbeat>
  readonly storedSequence: Effect.Effect<number | null>
  readonly shardScope: Scope.Closeable
}

/** lets other fibers run, for asserting that something did not happen */
export const settle = TestClock.withLive(Effect.sleep("20 millis"))

/** fails fast instead of hanging until the vitest timeout */
export const within = <A, E>(effect: Effect.Effect<A, E>) =>
  TestClock.withLive(Effect.timeout(effect, "1 second"))

/**
 * Runs `Shard.connect` against a scripted socket, the real memory state store
 * (with `set` recorded) and the real messaging hub. When `hook` is given it is
 * provided as the `DispatchHook`, with each call recorded.
 */
export const withShard = <A, E>(
  body: (h: Harness) => Effect.Effect<A, E>,
  hook?: (p: Discord.GatewayDispatchPayload) => Effect.Effect<void>,
): Promise<A> => {
  const events: Array<Event> = []
  const written: Array<MessageSend> = []

  return Effect.gen(function* () {
    const inbound = yield* Queue.unbounded<Discord.GatewayReceivePayload>()
    const dropped = yield* Deferred.make<void>()
    const heartbeat = yield* Deferred.make<Discord.GatewayHeartbeat>()

    const FakeWS = Layer.succeed(DiscordWS, {
      connect: ({ onConnecting }) =>
        Effect.gen(function* () {
          yield* onConnecting
          return {
            take: Queue.take(inbound),
            setUrl: () => Effect.void,
            write: (message: MessageSend) =>
              Effect.sync(() => {
                written.push(message)
                if (message === Reconnect) {
                  Deferred.doneUnsafe(dropped, Effect.void)
                } else if (message.op === Discord.GatewayOpcodes.Heartbeat) {
                  Deferred.doneUnsafe(heartbeat, Effect.succeed(message))
                }
              }),
          }
        }),
    })

    const RecordingStateStore = Layer.effect(
      ShardStateStore,
      Effect.gen(function* () {
        const store = yield* ShardStateStore
        return ShardStateStore.of({
          forShard: id => {
            const inner = store.forShard(id)
            return {
              ...inner,
              // yield first, as a real store would, so a publish that
              // happened before the set is seen first
              set: (state: ShardState) =>
                Effect.flatMap(Effect.yieldNow, () => {
                  events.push({ kind: "set", seq: state.sequence })
                  return inner.set(state)
                }),
            }
          },
        })
      }),
    ).pipe(Layer.provide(ShardStateStore.MemoryLive))

    const ShardTest = Layer.effect(Shard, makeShard).pipe(
      Layer.provideMerge(FakeWS),
      Layer.provideMerge(MesssagingLive),
      Layer.provideMerge(RecordingStateStore),
      Layer.provide(RateLimiterLive),
      Layer.provide(MemoryRateLimitStoreLive),
      Layer.provide(
        DiscordConfig.layer({ token: Redacted.make("test-token") }),
      ),
      Layer.provideMerge(
        hook
          ? Layer.succeed(DispatchHook, (p, context) =>
              Effect.suspend(() => {
                events.push({ kind: "hook", seq: p.s, context })
                return hook(p)
              }),
            )
          : Layer.empty,
      ),
    )

    return yield* Effect.gen(function* () {
      const shard = yield* Shard
      const { hub } = yield* Messaging
      const stateStore = (yield* ShardStateStore).forShard(shardId)

      const subscription = yield* PubSub.subscribe(hub)
      const seen = new Map<number, Deferred.Deferred<void>>()
      const publishedDeferred = (seq: number) => {
        let d = seen.get(seq)
        if (!d) {
          d = Deferred.makeUnsafe<void>()
          seen.set(seq, d)
        }
        return d
      }
      yield* PubSub.take(subscription).pipe(
        Effect.tap(p =>
          Effect.sync(() => {
            events.push({ kind: "publish", seq: p.s })
            if (typeof p.s === "number") {
              Deferred.doneUnsafe(publishedDeferred(p.s), Effect.void)
            }
          }),
        ),
        Effect.forever,
        Effect.forkScoped,
      )

      const shardScope = yield* Scope.make()
      yield* Effect.addFinalizer(() => Scope.close(shardScope, Exit.void))
      yield* shard.connect(shardId).pipe(
        Scope.provide(shardScope),
        Effect.provideService(WebSocketConstructor, () => {
          throw new Error("unused")
        }),
      )

      return yield* body({
        events,
        written,
        receive: (...frames) =>
          Effect.sync(() => {
            Queue.offerAllUnsafe(inbound, frames)
          }),
        published: seq => Deferred.await(publishedDeferred(seq)),
        dropped: Deferred.await(dropped),
        firstHeartbeat: Deferred.await(heartbeat),
        storedSequence: Effect.map(stateStore.get, state =>
          Option.getOrNull(Option.map(state, s => s.sequence)),
        ),
        shardScope,
      })
    }).pipe(Effect.scoped, Effect.provide(ShardTest))
  }).pipe(Effect.provide(TestClock.layer()), Effect.runPromise)
}

export const sequencesOf = (
  events: ReadonlyArray<Event>,
  kind: Event["kind"],
) => events.filter(e => e.kind === kind).map(e => e.seq)

export const kindsFor = (events: ReadonlyArray<Event>, seq: number) =>
  events.filter(e => e.seq === seq).map(e => e.kind)
