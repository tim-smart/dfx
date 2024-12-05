import { pipe } from "effect/Function"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Fiber from "effect/Fiber"
import * as PubSub from "effect/PubSub"
import * as Queue from "effect/Queue"
import type { YieldWrap } from "effect/Utils"

export const subscribeForEachPar = <R, E, A, X>(
  self: PubSub.PubSub<A>,
  effect: (_: A) => Effect.Effect<X, E, R>,
): Effect.Effect<never, E, R> =>
  Effect.flatMap(Deferred.make<never, E>(), deferred => {
    const run = pipe(
      PubSub.subscribe(self),
      Effect.flatMap(queue =>
        Effect.forever(
          Effect.flatMap(Queue.take(queue), a =>
            Effect.fork(
              Effect.catchAllCause(effect(a), cause =>
                Deferred.failCause(deferred, cause),
              ),
            ),
          ),
        ),
      ),
      Effect.scoped,
      Effect.interruptible,
    )

    return Effect.raceFirst(run, Deferred.await(deferred))
  })

export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect.Effect<A, E, R>,
  f: (_: A) => Effect.Effect<X, E1, R1>,
): Effect.Effect<never, E | E1, R | R1> =>
  Effect.gen(function* () {
    const deferred = yield* Deferred.make<never, E1>()
    let fiber: Fiber.RuntimeFiber<unknown, unknown> | undefined
    return yield* self.pipe(
      Effect.tap(() => (fiber ? Fiber.interruptFork(fiber) : Effect.void)),
      Effect.flatMap(a =>
        f(a).pipe(
          Effect.catchAllCause(cause => Deferred.failCause(deferred, cause)),
          Effect.fork,
          Effect.tap(fiber_ => {
            fiber = fiber_
          }),
        ),
      ),
      Effect.forever,
      Effect.raceFirst(Deferred.await(deferred)),
    )
  })

export function genFn<
  Eff extends YieldWrap<Effect.Effect<any, any, any>>,
  AEff,
  Args extends Array<any>,
>(
  body: (...args: Args) => Generator<Eff, AEff, never>,
): (
  ...args: Args
) => Effect.Effect<
  AEff,
  [Eff] extends [never]
    ? never
    : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer E, infer _R>>]
      ? E
      : never,
  [Eff] extends [never]
    ? never
    : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer _E, infer R>>]
      ? R
      : never
> {
  return function (...args) {
    return Effect.gen(() => body(...args))
  }
}
