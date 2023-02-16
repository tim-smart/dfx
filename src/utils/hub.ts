/**
 * @tsplus fluent effect/io/Hub subscribeForEach
 */
export const subscribeForEach = <R, E, A, X>(
  self: Hub<A>,
  effect: (_: A) => Effect<R, E, X>,
) => self.subscribe().flatMap(_ => _.take().flatMap(effect).forever).scoped

/**
 * @tsplus fluent effect/io/Queue/Dequeue transform
 */
export const transform = <A, B>(self: Dequeue<A>, f: (_: A) => B) =>
  Do($ => {
    const queue = $(Queue.unbounded<B>())

    const run = self.take().flatMap(_ => queue.offer(f(_))).forever

    return [queue, run] as const
  })
