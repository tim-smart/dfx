import { CacheDriver, ParentCacheDriver } from "./Cache/driver.js"

export * from "./Cache/driver.js"
export {
  create as memoryDriver,
  createWithParent as memoryParentDriver,
} from "./Cache/memory.js"
export {
  create as memoryTTLDriver,
  createWithParent as memoryTTLParentDriver,
} from "./Cache/memoryTTL.js"

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
  ops = Stream.empty,
  id,
  onMiss,
  onParentMiss,
}: {
  driver: ParentCacheDriver<EDriver, A>
  ops?: Stream<never, EOps, ParentCacheOp<A>>
  id: (_: A) => Effect<never, EMiss, readonly [parentId: string, id: string]>
  onMiss: (parentId: string, id: string) => Effect<never, EMiss, A>
  onParentMiss: (
    parentId: string,
  ) => Effect<never, EPMiss, [id: string, resource: A][]>
}) => {
  const sync = ops.tap((op): Effect<never, EDriver, void> => {
    switch (op.op) {
      case "create":
      case "update":
        return driver.set(op.parentId, op.resourceId, op.resource)

      case "delete":
        return driver.delete(op.parentId, op.resourceId)

      case "parentDelete":
        return driver.parentDelete(op.parentId)
    }
  }).runDrain

  const get = (parentId: string, id: string) =>
    driver
      .get(parentId, id)
      .someOrElseEffect(() =>
        onMiss(parentId, id).tap(a => driver.set(parentId, id, a)),
      )

  const put = (_: A) =>
    id(_).flatMap(([parentId, id]) => driver.set(parentId, id, _))

  const update = <R, E>(
    parentId: string,
    id: string,
    f: (_: A) => Effect<R, E, A>,
  ) =>
    get(parentId, id)
      .flatMap(f)
      .tap(_ => driver.set(parentId, id, _))

  return {
    ...driver,

    get,
    put,
    update,

    getForParent: (parentId: string) =>
      driver.getForParent(parentId).someOrElseEffect(() =>
        onParentMiss(parentId)
          .tap(entries =>
            Effect.allPar(
              entries.map(([id, a]) => driver.set(parentId, id, a)),
            ),
          )
          .map(entries => new Map(entries) as ReadonlyMap<string, A>),
      ),

    run: sync.zipParRight(driver.run),
  }
}

export const make = <EOps, EDriver, EMiss, A>({
  driver,
  ops = Stream.empty,
  id,
  onMiss,
}: {
  driver: CacheDriver<EDriver, A>
  ops?: Stream<never, EOps, CacheOp<A>>
  id: (_: A) => string
  onMiss: (id: string) => Effect<never, EMiss, A>
}) => {
  const sync = ops.tap((op): Effect<never, EDriver, void> => {
    switch (op.op) {
      case "create":
      case "update":
        return driver.set(op.resourceId, op.resource)

      case "delete":
        return driver.delete(op.resourceId)
    }
  }).runDrain

  const get = (id: string) =>
    driver
      .get(id)
      .someOrElseEffect(() => onMiss(id).tap(a => driver.set(id, a)))

  const put = (_: A) => driver.set(id(_), _)

  const update = <R, E>(id: string, f: (_: A) => Effect<R, E, A>) =>
    get(id)
      .flatMap(f)
      .tap(_ => driver.set(id, _))

  return {
    ...driver,
    get,
    put,
    update,
    run: sync.zipParRight(driver.run),
  }
}

export class CacheMissError {
  readonly _tag = "CacheMissError"
  constructor(readonly cacheName: string, readonly id: string) {}
}
