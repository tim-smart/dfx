import * as Option from "effect/Option"
import * as Schedule from "effect/Schedule"
import type * as Scope from "effect/Scope"
import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { CacheDriver, ParentCacheDriver } from "dfx/Cache/driver"

export * from "dfx/Cache/driver"
export {
  create as memoryDriver,
  createWithParent as memoryParentDriver,
} from "dfx/Cache/memory"
export {
  create as memoryTTLDriver,
  createWithParent as memoryTTLParentDriver,
} from "dfx/Cache/memoryTTL"

export type ParentCacheOp<T> =
  | { op: "create"; parentId: string; resourceId: string; resource: T }
  | { op: "update"; parentId: string; resourceId: string; resource: T }
  | { op: "delete"; parentId: string; resourceId: string }
  | { op: "parentDelete"; parentId: string }

export type CacheOp<T> =
  | { op: "create"; resourceId: string; resource: T }
  | { op: "update"; resourceId: string; resource: T }
  | { op: "delete"; resourceId: string }

const retryPolicy = Schedule.exponential("500 millis").pipe(
  Schedule.union(Schedule.spaced("10 seconds")),
)

export interface ParentCache<EDriver, EMiss, EPMiss, A> {
  readonly get: (
    parentId: string,
    id: string,
  ) => Effect.Effect<A, EDriver | EMiss>
  readonly put: (_: A) => Effect.Effect<void, EDriver | EMiss>
  readonly update: <R, E>(
    parentId: string,
    id: string,
    f: (_: A) => Effect.Effect<A, E, R>,
  ) => Effect.Effect<A, EDriver | EMiss | E, R>
  readonly getForParent: (
    parentId: string,
  ) => Effect.Effect<ReadonlyMap<string, A>, EDriver | EPMiss>
  readonly size: Effect.Effect<number, EDriver>
  readonly sizeForParent: (parentId: string) => Effect.Effect<number, EDriver>
  readonly set: (
    parentId: string,
    resourceId: string,
    resource: A,
  ) => Effect.Effect<void, EDriver>
  readonly delete: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<void, EDriver>
  readonly parentDelete: (parentId: string) => Effect.Effect<void, EDriver>
  readonly refreshTTL: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<void, EDriver>
}

export const makeWithParent = <EOps, EDriver, EMiss, EPMiss, A>({
  driver,
  id,
  onMiss,
  onParentMiss,
  ops = Stream.empty,
}: {
  driver: ParentCacheDriver<EDriver, A>
  ops?: Stream.Stream<ParentCacheOp<A>, EOps>
  id: (_: A) => Effect.Effect<readonly [parentId: string, id: string], EMiss>
  onMiss: (parentId: string, id: string) => Effect.Effect<A, EMiss>
  onParentMiss: (
    parentId: string,
  ) => Effect.Effect<Array<[id: string, resource: A]>, EPMiss>
}): Effect.Effect<ParentCache<EDriver, EMiss, EPMiss, A>, never, Scope.Scope> =>
  Effect.gen(function* (_) {
    yield* _(
      Stream.runDrain(
        Stream.tap(ops, (op): Effect.Effect<void, EDriver> => {
          switch (op.op) {
            case "create":
            case "update":
              return driver.set(op.parentId, op.resourceId, op.resource)

            case "delete":
              return driver.delete(op.parentId, op.resourceId)

            case "parentDelete":
              return driver.parentDelete(op.parentId)
          }
        }),
      ),
      Effect.tapErrorCause(_ => Effect.logError("ops error, restarting", _)),
      Effect.retry(retryPolicy),
      Effect.forkScoped,
      Effect.interruptible,
    )
    yield* _(
      driver.run,
      Effect.tapErrorCause(_ =>
        Effect.logError("cache driver error, restarting", _),
      ),
      Effect.retry(retryPolicy),
      Effect.forkScoped,
      Effect.interruptible,
    )

    const get = (parentId: string, id: string) =>
      Effect.flatMap(
        driver.get(parentId, id),
        Option.match({
          onNone: () =>
            Effect.tap(onMiss(parentId, id), a => driver.set(parentId, id, a)),
          onSome: Effect.succeed,
        }),
      )

    const put = (_: A) =>
      Effect.flatMap(id(_), ([parentId, id]) => driver.set(parentId, id, _))

    const update = <R, E>(
      parentId: string,
      id: string,
      f: (_: A) => Effect.Effect<A, E, R>,
    ) =>
      get(parentId, id).pipe(
        Effect.flatMap(f),
        Effect.tap(_ => driver.set(parentId, id, _)),
      )

    return {
      ...driver,

      get,
      put,
      update,

      getForParent: (parentId: string) =>
        Effect.flatMap(
          driver.getForParent(parentId),
          Option.match({
            onNone: () =>
              onParentMiss(parentId).pipe(
                Effect.tap(entries =>
                  Effect.all(
                    entries.map(([id, a]) => driver.set(parentId, id, a)),
                    { concurrency: "unbounded" },
                  ),
                ),
                Effect.map(
                  entries => new Map(entries) as ReadonlyMap<string, A>,
                ),
              ),
            onSome: Effect.succeed,
          }),
        ),
    } as const
  }).pipe(
    Effect.annotateLogs({
      package: "dfx",
      service: "Cache",
    }),
  )

export interface Cache<EDriver, EMiss, A> {
  readonly get: (id: string) => Effect.Effect<A, EDriver | EMiss>
  readonly put: (_: A) => Effect.Effect<void, EDriver>
  readonly update: <R, E>(
    id: string,
    f: (_: A) => Effect.Effect<A, E, R>,
  ) => Effect.Effect<A, EDriver | EMiss | E, R>
  readonly size: Effect.Effect<number, EDriver>
  readonly set: (
    resourceId: string,
    resource: A,
  ) => Effect.Effect<void, EDriver>
  readonly delete: (resourceId: string) => Effect.Effect<void, EDriver>
  readonly refreshTTL: (resourceId: string) => Effect.Effect<void, EDriver>
}

export const make = <EOps, EDriver, EMiss, A>({
  driver,
  id,
  onMiss,
  ops = Stream.empty,
}: {
  driver: CacheDriver<EDriver, A>
  ops?: Stream.Stream<CacheOp<A>, EOps>
  id: (_: A) => string
  onMiss: (id: string) => Effect.Effect<A, EMiss>
}): Effect.Effect<Cache<EDriver, EMiss, A>, never, Scope.Scope> =>
  Effect.gen(function* (_) {
    yield* _(
      Stream.runDrain(
        Stream.tap(ops, (op): Effect.Effect<void, EDriver> => {
          switch (op.op) {
            case "create":
            case "update":
              return driver.set(op.resourceId, op.resource)

            case "delete":
              return driver.delete(op.resourceId)
          }
        }),
      ),
      Effect.tapErrorCause(_ => Effect.logError("ops error, restarting", _)),
      Effect.retry(retryPolicy),
      Effect.forkScoped,
      Effect.interruptible,
    )

    yield* _(
      driver.run,
      Effect.tapErrorCause(_ =>
        Effect.logError("cache driver error, restarting", _),
      ),
      Effect.retry(retryPolicy),
      Effect.forkScoped,
      Effect.interruptible,
    )

    const get = (id: string) =>
      Effect.flatMap(
        driver.get(id),
        Option.match({
          onNone: () => Effect.tap(onMiss(id), a => driver.set(id, a)),
          onSome: Effect.succeed,
        }),
      )

    const put = (_: A) => driver.set(id(_), _)

    const update = <R, E>(id: string, f: (_: A) => Effect.Effect<A, E, R>) =>
      get(id).pipe(
        Effect.flatMap(f),
        Effect.tap(_ => driver.set(id, _)),
      )

    return {
      ...driver,
      get,
      put,
      update,
    } as const
  }).pipe(
    Effect.annotateLogs({
      package: "dfx",
      service: "Cache",
    }),
  )

export class CacheMissError {
  readonly _tag = "CacheMissError"
  constructor(
    readonly cacheName: string,
    readonly id: string,
  ) {}
}
