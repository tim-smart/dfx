import { constant, constTrue } from "effect/Function"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Fiber from "effect/Fiber"
import * as PubSub from "effect/PubSub"
import * as Scope from "effect/Scope"
import * as Exit from "effect/Exit"

export const subscribeForEachPar = <R, E, A, X>(
  self: PubSub.PubSub<A>,
  effect: (_: A) => Effect.Effect<X, E, R>,
): Effect.Effect<never, E, R> =>
  Effect.scopedWith(
    Effect.fnUntraced(function* (scope) {
      const deferred = yield* Deferred.make<never, E>()
      const sub = yield* PubSub.subscribe(self).pipe(Scope.provide(scope))
      const services = yield* Effect.services<R>()
      const runFork = Effect.runForkWith(services)
      const track = Fiber.runIn(scope)
      function onExit(exit: Exit.Exit<X, E>) {
        if (Exit.isFailure(exit)) {
          Deferred.doneUnsafe(deferred, exit as Exit.Exit<never, E>)
        }
      }
      yield* Effect.whileLoop<[A, ...A[]], never, never>({
        while: constTrue,
        body: constant(PubSub.takeAll(sub)),
        step(items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i]
            track(runFork(effect(item))).addObserver(onExit)
          }
        },
      }).pipe(Effect.raceFirst(Deferred.await(deferred)))
      return yield* Effect.never
    }),
  )

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
      Effect.onExit(() => (fiber ? Fiber.interrupt(fiber) : Effect.void)),
    )
  })
