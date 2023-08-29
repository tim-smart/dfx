import { pipe } from "@effect/data/Function"
import * as Deferred from "@effect/io/Deferred"
import * as Effect from "@effect/io/Effect"
import type * as Fiber from "@effect/io/Fiber"
import * as Hub from "@effect/io/Hub"
import * as Queue from "@effect/io/Queue"
import * as ScopedRef from "@effect/io/ScopedRef"

export const subscribeForEachPar = <R, E, A, X>(
  self: Hub.Hub<A>,
  effect: (_: A) => Effect.Effect<R, E, X>,
): Effect.Effect<R, E, never> =>
  Effect.flatMap(Deferred.make<E, never>(), deferred => {
    const run = pipe(
      Hub.subscribe(self),
      Effect.flatMap(queue =>
        Effect.forever(
          Effect.flatMap(Queue.take(queue), _ =>
            Effect.forkScoped(
              Effect.catchAllCause(effect(_), _ =>
                Deferred.failCause(deferred, _),
              ),
            ),
          ),
        ),
      ),
      Effect.scoped,
    )

    return Effect.all([run, Deferred.await(deferred)], {
      concurrency: "unbounded",
      discard: true,
    }) as Effect.Effect<R, E, never>
  })

export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect.Effect<R, E, A>,
  f: (_: A) => Effect.Effect<R1, E1, X>,
): Effect.Effect<R | R1, E | E1, never> =>
  pipe(
    Effect.all([
      Deferred.make<E1, never>(),
      ScopedRef.fromAcquire<R1, never, Fiber.RuntimeFiber<unknown, unknown>>(
        Effect.fork(Effect.unit),
      ),
    ]),
    Effect.flatMap(([causeDeferred, fiberRef]) => {
      const run = Effect.forever(
        Effect.flatMap(self, _ =>
          ScopedRef.set(
            fiberRef,
            Effect.forkScoped(
              Effect.tapErrorCause(f(_), _ =>
                Deferred.failCause(causeDeferred, _),
              ),
            ),
          ),
        ),
      )

      return Effect.all([run, Deferred.await(causeDeferred)], {
        concurrency: "unbounded",
        discard: true,
      }) as Effect.Effect<R | R1, E | E1, never>
    }),
    Effect.scoped,
  )
