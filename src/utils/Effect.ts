import { pipe } from "effect/Function"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import type * as Fiber from "effect/Fiber"
import * as PubSub from "effect/PubSub"
import * as Queue from "effect/Queue"

export const subscribeForEachPar = <R, E, A, X>(
  self: PubSub.PubSub<A>,
  effect: (_: A) => Effect.Effect<X, E, R>,
): Effect.Effect<never, E, R> =>
  Effect.flatMap(Deferred.make<never, E>(), deferred => {
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
      Effect.interruptible,
    )

    return Effect.all([run, Deferred.await(deferred)], {
      concurrency: "unbounded",
      discard: true,
    }) as Effect.Effect<never, E, R>
  })

export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect.Effect<A, E, R>,
  f: (_: A) => Effect.Effect<X, E1, R1>,
): Effect.Effect<never, E | E1, R | R1> =>
  pipe(
    Effect.all([Deferred.make<never, E1>(), Effect.fiberId]),
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
        Effect.interruptible,
      )

      return Effect.all([run, Deferred.await(causeDeferred)], {
        concurrency: "unbounded",
        discard: true,
      }) as Effect.Effect<never, E | E1, R | R1>
    }),
  )
