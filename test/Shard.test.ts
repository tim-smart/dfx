import { Reconnect } from "dfx/DiscordGateway/DiscordWS"
import * as Discord from "dfx/types"
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
})
