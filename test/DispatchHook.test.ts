import * as Discord from "dfx/types"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
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

const blockOn =
  (seq: number, started: Deferred.Deferred<void>) =>
  (p: Discord.GatewayDispatchPayload) =>
    p.s === seq
      ? Effect.andThen(Deferred.succeed(started, void 0), Effect.never)
      : Effect.void

const failOnce = (seq: number) => {
  let failed = false
  return (p: Discord.GatewayDispatchPayload) =>
    Effect.suspend(() => {
      if (p.s !== seq || failed) return Effect.void
      failed = true
      return Effect.die("hook failed")
    })
}

const handshakes = (h: Harness) =>
  h.written.filter(
    m =>
      typeof m !== "symbol" &&
      (m.op === Discord.GatewayOpcodes.Identify ||
        m.op === Discord.GatewayOpcodes.Resume),
  )

describe("DispatchHook", () => {
  it("runs before each dispatch is stored and published, with the READY session", () =>
    withShard(
      h =>
        Effect.gen(function* () {
          yield* h.receive(hello(1000), ready(1), dispatch(2), dispatch(3))
          yield* within(h.published(3))

          for (const seq of [1, 2, 3]) {
            expect(kindsFor(h.events, seq)).toEqual(["hook", "set", "publish"])
          }
          const context = { shard: shardId, sessionId }
          expect(
            h.events.filter(e => e.kind === "hook").map(e => e.context),
          ).toEqual([context, context, context])
        }),
      () => Effect.void,
    ))

  it("a pending hook holds back later dispatches and the stored sequence, and is interrupted on shutdown", () => {
    const started = Deferred.makeUnsafe<void>()
    const interrupted = Deferred.makeUnsafe<void>()
    return withShard(
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
      p =>
        Effect.onInterrupt(blockOn(3, started)(p), () =>
          Deferred.succeed(interrupted, void 0),
        ),
    )
  })

  it("heartbeats report the latest received sequence while a hook is pending", () => {
    const started = Deferred.makeUnsafe<void>()
    return withShard(
      h =>
        Effect.gen(function* () {
          yield* h.receive(hello(1000), ready(1), dispatch(5))
          yield* within(Deferred.await(started))
          yield* TestClock.adjust(1000)

          expect((yield* h.firstHeartbeat).d).toBe(5)
          expect(yield* h.storedSequence).toBe(1)
        }),
      blockOn(5, started),
    )
  })

  it("a hook defect reconnects and resumes from the stored sequence, replaying the dispatch through the hook", () =>
    withShard(
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

          yield* h.receive(hello(1000), dispatch(3), dispatch(4))
          yield* within(h.published(4))

          expect(handshakes(h)).toEqual([
            expect.objectContaining({ op: Discord.GatewayOpcodes.Identify }),
            expect.objectContaining({
              op: Discord.GatewayOpcodes.Resume,
              d: expect.objectContaining({ session_id: sessionId, seq: 2 }),
            }),
          ])
          expect(sequencesOf(h.events, "hook")).toEqual([1, 2, 3, 3, 4])
          expect(sequencesOf(h.events, "publish")).toEqual([1, 2, 3, 4])
          expect(yield* h.storedSequence).toBe(4)
        }),
      failOnce(3),
    ))

  it("a hook defect on READY identifies again, as there is no session to resume", () =>
    withShard(
      h =>
        Effect.gen(function* () {
          yield* h.receive(hello(1000), ready(1), dispatch(2))
          yield* within(h.dropped)
          yield* settle

          expect(yield* h.storedSequence).toBe(null)

          yield* h.receive(hello(1000), ready(1), dispatch(2))
          yield* within(h.published(2))

          expect(handshakes(h)).toEqual([
            expect.objectContaining({ op: Discord.GatewayOpcodes.Identify }),
            expect.objectContaining({ op: Discord.GatewayOpcodes.Identify }),
          ])
        }),
      failOnce(1),
    ))
})
