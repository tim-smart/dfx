import { DispatchHook } from "dfx/DiscordGateway/Shard/DispatchHook"
import * as Discord from "dfx/types"
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

const failOnce = (seq: number) => {
  let failed = false
  return (p: Discord.GatewayDispatchPayload) =>
    Effect.suspend(() => {
      if (p.s !== seq || failed) return Effect.void
      failed = true
      return Effect.die("hook failed")
    })
}

/** IDENTIFY and RESUME payloads sent, with the token left out */
const handshakes = (h: Harness) =>
  h.written.flatMap((m): Array<{ op: number; d?: unknown }> =>
    typeof m === "symbol"
      ? []
      : m.op === Discord.GatewayOpcodes.Identify
        ? [{ op: m.op }]
        : m.op === Discord.GatewayOpcodes.Resume
          ? [{ op: m.op, d: m.d }]
          : [],
  )

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

  it("a hook defect reconnects and resumes from the stored sequence, replaying the dispatch through the hook", () =>
    withHook(failOnce(3), h =>
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
          { op: Discord.GatewayOpcodes.Identify },
          {
            op: Discord.GatewayOpcodes.Resume,
            d: expect.objectContaining({ session_id: sessionId, seq: 2 }),
          },
        ])
        expect(sequencesOf(h.events, "hook")).toEqual([1, 2, 3, 3, 4])
        expect(sequencesOf(h.events, "publish")).toEqual([1, 2, 3, 4])
        expect(yield* h.storedSequence).toBe(4)
      }),
    ))

  it("a hook defect on READY identifies again, as there is no session to resume", () =>
    withHook(failOnce(1), h =>
      Effect.gen(function* () {
        yield* h.receive(hello(1000), ready(1), dispatch(2))
        yield* within(h.dropped)
        yield* settle

        expect(yield* h.storedSequence).toBe(null)

        yield* h.receive(hello(1000), ready(1), dispatch(2))
        yield* within(h.published(2))

        expect(handshakes(h)).toEqual([
          { op: Discord.GatewayOpcodes.Identify },
          { op: Discord.GatewayOpcodes.Identify },
        ])
      }),
    ))
})
