import * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"
import * as Stream from "@effect/stream/Stream"
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

export const makeWithParent = <EOps, EDriver, EMiss, EPMiss, A>({
  driver,
  id,
  onMiss,
  onParentMiss,
  ops = Stream.empty,
}: {
  driver: ParentCacheDriver<EDriver, A>
  ops?: Stream.Stream<never, EOps, ParentCacheOp<A>>
  id: (
    _: A,
  ) => Effect.Effect<never, EMiss, readonly [parentId: string, id: string]>
  onMiss: (parentId: string, id: string) => Effect.Effect<never, EMiss, A>
  onParentMiss: (
    parentId: string,
  ) => Effect.Effect<never, EPMiss, Array<[id: string, resource: A]>>
}) => {
  const sync = Stream.runDrain(
    Stream.tap(ops, (op): Effect.Effect<never, EDriver, void> => {
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
    f: (_: A) => Effect.Effect<R, E, A>,
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
              Effect.map(entries => new Map(entries) as ReadonlyMap<string, A>),
            ),
          onSome: Effect.succeed,
        }),
      ),

    run: Effect.all([sync, driver.run], {
      concurrency: "unbounded",
      discard: true,
    }),
  }
}

export const make = <EOps, EDriver, EMiss, A>({
  driver,
  id,
  onMiss,
  ops = Stream.empty,
}: {
  driver: CacheDriver<EDriver, A>
  ops?: Stream.Stream<never, EOps, CacheOp<A>>
  id: (_: A) => string
  onMiss: (id: string) => Effect.Effect<never, EMiss, A>
}) => {
  const sync = Stream.runDrain(
    Stream.tap(ops, (op): Effect.Effect<never, EDriver, void> => {
      switch (op.op) {
        case "create":
        case "update":
          return driver.set(op.resourceId, op.resource)

        case "delete":
          return driver.delete(op.resourceId)
      }
    }),
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

  const update = <R, E>(id: string, f: (_: A) => Effect.Effect<R, E, A>) =>
    get(id).pipe(
      Effect.flatMap(f),
      Effect.tap(_ => driver.set(id, _)),
    )

  return {
    ...driver,
    get,
    put,
    update,
    run: Effect.all([sync, driver.run], {
      concurrency: "unbounded",
      discard: true,
    }),
  }
}

export class CacheMissError {
  readonly _tag = "CacheMissError"
  constructor(
    readonly cacheName: string,
    readonly id: string,
  ) {}
}
