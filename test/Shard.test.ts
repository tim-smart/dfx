import { Reconnect } from "dfx/DiscordGateway/DiscordWS"
import * as Discord from "dfx/types"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as TestClock from "effect/testing/TestClock"
import {
  dispatch,
  hello,
  kindsFor,
  ready,
  settle,
  withShard,
  within,
} from "./utils/shard.ts"

const invalidSession = (resumable: boolean) =>
  ({
    op: Discord.GatewayOpcodes.InvalidSession,
    d: resumable,
    s: null,
    t: null,
  }) as Discord.GatewayReceivePayload

const reconnectFrame = {
  op: Discord.GatewayOpcodes.Reconnect,
  d: null,
  s: null,
  t: null,
} as Discord.GatewayReceivePayload

describe("Shard", () => {
  it("without a dispatch hook, stores each sequence before publishing it", () =>
    withShard(h =>
      Effect.gen(function* () {
        yield* h.receive(hello(1000), ready(1), dispatch(2))
        yield* within(h.published(2))

        expect(kindsFor(h.events, 1)).toEqual(["set", "publish"])
        expect(kindsFor(h.events, 2)).toEqual(["set", "publish"])
        expect(yield* h.storedSequence).toBe(2)
      }),
    ))

  it("reconnects if HELLO does not arrive within 30s", () =>
    withShard(h =>
      Effect.gen(function* () {
        yield* TestClock.adjust("29999 millis")
        yield* settle
        expect(h.written).toEqual([])

        yield* TestClock.adjust("1 millis")
        yield* within(h.dropped)
        expect(h.written).toEqual([Reconnect])
      }),
    ))

  it("resets the gateway URL on a non-resumable InvalidSession", () =>
    withShard(h =>
      Effect.gen(function* () {
        yield* h.receive(hello(1000), ready(1))
        yield* within(h.published(1))
        expect(h.urls).toEqual(["wss://resume.example"])

        yield* h.receive(invalidSession(false))
        yield* within(h.dropped)

        expect(yield* h.storedSequence).toBe(null)
        expect(h.urls).toEqual(["wss://resume.example", undefined])
      }),
    ))

  it.each([
    ["fails", true],
    ["succeeds", false],
  ] as const)(
    "a delayed READY hook that %s after replacement does not close or cancel the new connection's HELLO timer",
    (_: string, shouldFail: boolean) => {
      const started = Deferred.makeUnsafe<void>()
      const release = Deferred.makeUnsafe<void>()
      return withShard(
        h =>
          Effect.gen(function* () {
            yield* h.receive(hello(41_250), ready(1))
            yield* within(Deferred.await(started))

            yield* h.reopen
            yield* Deferred.succeed(release, void 0)
            if (shouldFail) {
              yield* settle
            } else {
              yield* within(h.published(1))
            }

            expect(h.written.filter(m => m === Reconnect)).toEqual([])

            yield* TestClock.adjust("29999 millis")
            yield* settle
            expect(h.written.filter(m => m === Reconnect)).toEqual([])

            yield* TestClock.adjust("1 millis")
            yield* within(h.dropped)
            expect(h.written.filter(m => m === Reconnect)).toEqual([Reconnect])
          }),
        p =>
          p.t === "READY"
            ? Effect.gen(function* () {
                yield* Deferred.succeed(started, void 0)
                yield* Deferred.await(release)
                if (shouldFail) return yield* Effect.die("hook failed")
              })
            : Effect.void,
      )
    },
  )

  it("discards queued frames from an old connection without starting a handshake or closing its replacement", () => {
    const started = Deferred.makeUnsafe<void>()
    const release = Deferred.makeUnsafe<void>()
    return withShard(
      h =>
        Effect.gen(function* () {
          yield* h.receive(hello(41_250), ready(1))
          yield* within(Deferred.await(started))
          const handshakesBefore = h.written.filter(
            m =>
              typeof m !== "symbol" &&
              (m.op === Discord.GatewayOpcodes.Identify ||
                m.op === Discord.GatewayOpcodes.Resume),
          ).length

          // Open A and queue its HELLO and RECONNECT while the previous READY hook is blocked,
          // then replace A with B before releasing the hook.
          yield* h.reopen
          yield* h.receive(hello(41_250), reconnectFrame)
          yield* h.reopen

          yield* Deferred.succeed(release, void 0)
          yield* within(h.published(1))
          yield* settle

          expect(
            h.written.filter(
              m =>
                typeof m !== "symbol" &&
                (m.op === Discord.GatewayOpcodes.Identify ||
                  m.op === Discord.GatewayOpcodes.Resume),
            ),
          ).toHaveLength(handshakesBefore)
          expect(h.written.filter(m => m === Reconnect)).toEqual([])

          yield* TestClock.adjust("29999 millis")
          yield* settle
          expect(h.written.filter(m => m === Reconnect)).toEqual([])

          yield* TestClock.adjust("1 millis")
          yield* within(h.dropped)
          expect(h.written.filter(m => m === Reconnect)).toEqual([Reconnect])
        }),
      p =>
        p.t === "READY"
          ? Effect.gen(function* () {
              yield* Deferred.succeed(started, void 0)
              yield* Deferred.await(release)
            })
          : Effect.void,
    )
  })
})
