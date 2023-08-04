import * as Option from "@effect/data/Option"
import * as Deferred from "@effect/io/Deferred"
import * as Effect from "@effect/io/Effect"
import * as Fiber from "@effect/io/Fiber"
import * as Hub from "@effect/io/Hub"
import * as Queue from "@effect/io/Queue"
import * as Ref from "@effect/io/Ref"

export const subscribeForEachPar = <R, E, A, X>(
  self: Hub.Hub<A>,
  effect: (_: A) => Effect.Effect<R, E, X>,
): Effect.Effect<R, E, never> =>
  Effect.flatMap(Deferred.make<E, never>(), deferred => {
    const run = Hub.subscribe(self).pipe(
      Effect.flatMap(queue =>
        Queue.take(queue).pipe(
          Effect.flatMap(_ =>
            effect(_).pipe(
              Effect.catchAllCause(_ => Deferred.failCause(deferred, _)),
              Effect.fork,
            )
          ),
          Effect.forever,
        )
      ),
      Effect.scoped,
    )

    return Effect.all([run, Deferred.await(deferred)], {
      concurrency: "unbounded",
      discard: true,
    }).pipe(Effect.forever)
  })

/**
 * @tsplus fluent effect/io/Effect foreverSwitch
 */
export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect.Effect<R, E, A>,
  f: (_: A) => Effect.Effect<R1, E1, X>,
): Effect.Effect<R | R1, E | E1, never> =>
  Effect.flatMap(
    Effect.all([
      Deferred.make<E1, never>(),
      Ref.make<Option.Option<Fiber.RuntimeFiber<E1, X>>>(Option.none()),
    ]),
    ([causeDeferred, fiberRef]) => {
      const run = Effect.flatMap(self, _ =>
        f(_).pipe(
          Effect.tapErrorCause(_ => Deferred.failCause(causeDeferred, _)),
          Effect.fork,
        )).pipe(
          Effect.flatMap(fiber => Ref.getAndSet(fiberRef, Option.some(fiber))),
          Effect.tap(_ =>
            Option.match(_, {
              onNone: () => Effect.unit,
              onSome: fiber => Fiber.interrupt(fiber),
            })
          ),
          Effect.forever,
        )

      return Effect.all([run, Deferred.await(causeDeferred)], {
        concurrency: "unbounded",
        discard: true,
      }).pipe(Effect.forever)
    },
  )
