import { pipe } from "effect/Function"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import type * as Fiber from "effect/Fiber"
import * as PubSub from "effect/PubSub"

export const subscribeForEachPar = <R, E, A, X>(
  self: PubSub.PubSub<A>,
  effect: (_: A) => Effect.Effect<X, E, R>,
): Effect.Effect<never, E, R> =>
  Effect.flatMap(Deferred.make<never, E>(), deferred => {
    const run = pipe(
      PubSub.subscribe(self),
      Effect.flatMap(queue =>
        Effect.forever(
          Effect.flatMap(PubSub.take(queue), a =>
            Effect.forkChild(
              Effect.catchCause(effect(a), cause =>
                Deferred.failCause(deferred, cause),
              ),
            ),
          ),
          { disableYield: true },
        ),
      ),
      Effect.scoped,
    )

    return Effect.raceFirst(run, Deferred.await(deferred))
  })

export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect.Effect<A, E, R>,
  f: (_: A) => Effect.Effect<X, E1, R1>,
): Effect.Effect<never, E | E1, R | R1> =>
  Effect.gen(function* () {
    const deferred = yield* Deferred.make<never, E1>()
    let fiber: Fiber.Fiber<unknown, unknown> | undefined
    return yield* self.pipe(
      Effect.tap(() => {
        fiber?.interruptUnsafe()
        return Effect.void
      }),
      Effect.flatMap(a =>
        f(a).pipe(
          Effect.catchCause(cause => Deferred.failCause(deferred, cause)),
          Effect.forkChild,
          Effect.tap(fiber_ => {
            fiber = fiber_
            return Effect.void
          }),
        ),
      ),
      Effect.forever({ disableYield: true }),
      Effect.raceFirst(Deferred.await(deferred)),
    )
  })
