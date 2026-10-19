import * as Effect from "effect/Effect"
import {
  dispatch,
  hello,
  kindsFor,
  ready,
  withShard,
  within,
} from "./utils/shard.ts"

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
})
