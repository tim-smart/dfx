import { DispatchHook } from "dfx/DiscordGateway/Shard/DispatchHook"
import type * as Discord from "dfx/types"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import * as Scope from "effect/Scope"
import * as TestClock from "effect/testing/TestClock"
import type { Harness } from "./utils/shard.ts"
import {
  dispatch,
  hello,
  kindsFor,
  ready,
  sequencesOf,
  sessionId,
  settle,
  shardId,
  withShard,
  within,
} from "./utils/shard.ts"

const withHook = <A, E>(
  hook: (p: Discord.GatewayDispatchPayload) => Effect.Effect<void>,
  body: (h: Harness) => Effect.Effect<A, E>,
) =>
  withShard(body, events =>
    Layer.succeed(DispatchHook, (p, context) =>
      Effect.suspend(() => {
        events.push({ kind: "hook", seq: p.s, context })
        return hook(p)
      }),
    ),
  )

const blockOn =
  (seq: number, started: Deferred.Deferred<void>) =>
  (p: Discord.GatewayDispatchPayload) =>
    p.s === seq
      ? Effect.andThen(Deferred.succeed(started, void 0), Effect.never)
      : Effect.void

describe("DispatchHook", () => {
  it("runs before each dispatch is stored and published, with the READY session", () =>
    withHook(
      () => Effect.void,
      h =>
        Effect.gen(function* () {
          yield* h.receive(hello(1000), ready(1), dispatch(2), dispatch(3))
          yield* within(h.published(3))

          for (const seq of [1, 2, 3]) {
            expect(kindsFor(h.events, seq)).toEqual(["hook", "set", "publish"])
          }
          expect(
            h.events.filter(e => e.kind === "hook").map(e => e.context),
          ).toEqual([1, 2, 3].map(() => ({ shard: shardId, sessionId })))
        }),
    ))

  it("a pending hook holds back later dispatches and the stored sequence, and is interrupted on shutdown", () => {
    const started = Deferred.makeUnsafe<void>()
    const interrupted = Deferred.makeUnsafe<void>()
    return withHook(
      p =>
        Effect.onInterrupt(blockOn(3, started)(p), () =>
          Deferred.succeed(interrupted, void 0),
        ),
      h =>
        Effect.gen(function* () {
          yield* h.receive(
            hello(1000),
            ready(1),
            dispatch(2),
            dispatch(3),
            dispatch(4),
          )
          yield* within(Deferred.await(started))
          yield* settle

          expect(sequencesOf(h.events, "hook")).toEqual([1, 2, 3])
          expect(sequencesOf(h.events, "publish")).toEqual([1, 2])
          expect(yield* h.storedSequence).toBe(2)

          yield* within(Scope.close(h.shardScope, Exit.void))
          expect(Deferred.isDoneUnsafe(interrupted)).toBe(true)
          expect(yield* h.storedSequence).toBe(2)
        }),
    )
  })

  it("heartbeats report the latest received sequence while a hook is pending", () => {
    const started = Deferred.makeUnsafe<void>()
    return withHook(blockOn(5, started), h =>
      Effect.gen(function* () {
        yield* h.receive(hello(1000), ready(1), dispatch(5))
        yield* within(Deferred.await(started))
        yield* TestClock.adjust(1000)

        expect((yield* h.firstHeartbeat).d).toBe(5)
        expect(yield* h.storedSequence).toBe(1)
      }),
    )
  })

  it("a hook defect drops the connection without storing or publishing the dispatch", () =>
    withHook(
      p => (p.s === 3 ? Effect.die("hook failed") : Effect.void),
      h =>
        Effect.gen(function* () {
          yield* h.receive(
            hello(1000),
            ready(1),
            dispatch(2),
            dispatch(3),
            dispatch(4),
          )
          yield* within(h.dropped)
          yield* settle

          expect(sequencesOf(h.events, "publish")).toEqual([1, 2])
          expect(yield* h.storedSequence).toBe(2)
        }),
    ))
})
