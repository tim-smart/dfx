import { pipe } from "effect/Function"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import type * as Fiber from "effect/Fiber"
import * as PubSub from "effect/PubSub"
import * as Queue from "effect/Queue"

export const subscribeForEachPar = <R, E, A, X>(
  self: PubSub.PubSub<A>,
  effect: (_: A) => Effect.Effect<R, E, X>,
): Effect.Effect<R, E, never> =>
  Effect.flatMap(Deferred.make<E, never>(), deferred => {
    const run = pipe(
      PubSub.subscribe(self),
      Effect.flatMap(queue =>
        Effect.forever(
          Effect.flatMap(Queue.take(queue), _ =>
            Effect.fork(
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
    Effect.all([Deferred.make<E1, never>(), Effect.fiberId]),
    Effect.flatMap(([causeDeferred, fiberId]) => {
      let fiber: Fiber.RuntimeFiber<unknown, unknown> | undefined

      const run = pipe(
        self,
        Effect.tap(() =>
          fiber ? fiber.interruptAsFork(fiberId) : Effect.unit,
        ),
        Effect.flatMap(_ =>
          pipe(
            f(_),
            Effect.tapErrorCause(_ => Deferred.failCause(causeDeferred, _)),
            Effect.fork,
          ),
        ),
        Effect.tap(fiber_ =>
          Effect.sync(() => {
            fiber = fiber_
          }),
        ),
        Effect.forever,
      )

      return Effect.all([run, Deferred.await(causeDeferred)], {
        concurrency: "unbounded",
        discard: true,
      }) as Effect.Effect<R | R1, E | E1, never>
    }),
  )
