/**
 * @tsplus fluent effect/io/Hub subscribeForEachPar
 */
export const subscribeForEachPar = <R, E, A, X>(
  self: Hub<A>,
  effect: (_: A) => Effect<R, E, X>,
) =>
  Do($ => {
    const deferred = $(Deferred.make<E, never>())

    const run = self
      .subscribe()
      .flatMap(
        queue =>
          queue
            .take()
            .flatMap(
              _ => effect(_).catchAllCause(_ => deferred.failCause(_)).fork,
            ).forever,
      ).scoped

    return $(run.zipParLeft(deferred.await))
  })

/**
 * @tsplus fluent effect/io/Effect foreverSwitch
 */
export const foreverSwitch = <R, E, A, R1, E1, X>(
  self: Effect<R, E, A>,
  f: (_: A) => Effect<R1, E1, X>,
): Effect<R | R1, E | E1, never> =>
  Do($ => {
    const causeDeferred = $(Deferred.make<E1, never>())
    const fiberRef = $(Ref.make<Maybe<RuntimeFiber<E1, X>>>(Maybe.none()))

    const run = self
      .flatMap(_ => f(_).tapErrorCause(_ => causeDeferred.failCause(_)).fork)
      .flatMap(fiber => fiberRef.getAndSet(Maybe.some(fiber)))
      .tap(_ =>
        _.match(
          () => Effect.unit(),
          fiber => fiber.interrupt,
        ),
      ).forever

    return $(run.zipParLeft(causeDeferred.await))
  })
