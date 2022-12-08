export type Success<A extends Effect<any, any, any>> = A extends Effect<
  any,
  any,
  infer R
>
  ? R
  : never

/**
 * @tsplus static effect/io/Effect.Ops tryCatchAbort
 */
export const tryCatchAbort = <E, A>(
  f: (ac: AbortSignal) => Promise<A>,
  onError: (e: unknown) => E,
): Effect<never, E, A> =>
  Effect.async((resume) => {
    const controller = new AbortController()

    f(controller.signal)
      .then((a) => resume(Effect.succeed(a)))
      .catch((e) => resume(Effect.fail(onError(e))))

    return Either.left(
      Effect.sync(() => {
        controller.abort()
      }),
    )
  })
