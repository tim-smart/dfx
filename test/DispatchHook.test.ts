import * as Discord from "dfx/types"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Queue from "effect/Queue"
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
          yield* TestClock.adjust("1 second")
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
          yield* TestClock.adjust("1 second")
          yield* within(h.published(2))

          expect(handshakes(h)).toEqual([
            expect.objectContaining({ op: Discord.GatewayOpcodes.Identify }),
            expect.objectContaining({ op: Discord.GatewayOpcodes.Identify }),
          ])
        }),
      failOnce(1),
    ))

  describe("reconnects after a failure", () => {
    // Discord's heartbeat interval is about 41s, so the longer waits below
    // also run through heartbeats and the 30s handshake timeout
    const heartbeatInterval = 41_250

    /**
     * Fails `seq` and reconnects the socket straight away, then once more
     * halfway through `delay`, as heartbeat, handshake timeout or Discord
     * closes would. Neither reconnect may start the handshake early.
     */
    const failAndWait = (
      h: Harness,
      failures: Queue.Queue<void>,
      seq: number,
      delay: number,
    ) =>
      Effect.gen(function* () {
        yield* h.receive(dispatch(seq))
        yield* within(Queue.take(failures))
        yield* settle
        const before = handshakes(h).length

        yield* h.reopen
        yield* h.receive(hello(heartbeatInterval))
        yield* TestClock.adjust(delay / 2)
        yield* h.reopen
        yield* h.receive(hello(heartbeatInterval))
        yield* TestClock.adjust(delay / 2 - 1)
        yield* settle
        expect(handshakes(h).length, `before ${delay}ms`).toBe(before)

        yield* TestClock.adjust(1)
        yield* settle
        expect(handshakes(h).length, `at ${delay}ms`).toBeGreaterThan(before)
      })

    const failingOn =
      (
        failures: Queue.Queue<void>,
        shouldFail: (p: Discord.GatewayDispatchPayload) => boolean,
      ) =>
      (p: Discord.GatewayDispatchPayload) =>
        Effect.suspend(() =>
          shouldFail(p)
            ? Effect.andThen(
                Queue.offer(failures, void 0),
                Effect.die("hook failed"),
              )
            : Effect.void,
        )

    it("back off exponentially from 1s to a 2 minute cap, however the socket reconnects", () => {
      const failures = Effect.runSync(Queue.unbounded<void>())
      return withShard(
        h =>
          Effect.gen(function* () {
            yield* h.receive(hello(heartbeatInterval), ready(1), dispatch(2))
            yield* within(h.published(2))

            for (const delay of [
              1_000, 2_000, 4_000, 8_000, 16_000, 32_000, 64_000, 120_000,
              120_000,
            ]) {
              yield* failAndWait(h, failures, 3, delay)
            }
          }),
        failingOn(failures, p => p.s === 3),
      )
    })

    it("start again from 1s after a dispatch is committed", () => {
      const failures = Effect.runSync(Queue.unbounded<void>())
      let failuresOn3 = 0
      return withShard(
        h =>
          Effect.gen(function* () {
            yield* h.receive(hello(heartbeatInterval), ready(1), dispatch(2))
            yield* within(h.published(2))

            yield* failAndWait(h, failures, 3, 1_000)
            yield* failAndWait(h, failures, 3, 2_000)
            yield* h.receive(dispatch(3))
            yield* within(h.published(3))

            yield* failAndWait(h, failures, 4, 1_000)
          }),
        failingOn(failures, p => p.s === 4 || (p.s === 3 && failuresOn3++ < 2)),
      )
    })
  })
})
