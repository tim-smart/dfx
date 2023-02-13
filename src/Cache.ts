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
  onMiss,
  onParentMiss,
}: {
  driver: ParentCacheDriver<EDriver, A>
  ops?: Stream<never, EOps, ParentCacheOp<A>>
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

  return {
    ...driver,
    get: (parentId: string, id: string) =>
      driver
        .get(parentId, id)
        .someOrElseEffect(() =>
          onMiss(parentId, id).tap(a => driver.set(parentId, id, a)),
        ),

    getForParent: (parentId: string) =>
      driver.getForParent(parentId).someOrElseEffect(() =>
        onParentMiss(parentId)
          .tap(
            entries =>
              entries.map(([id, a]) => driver.set(parentId, id, a))
                .collectAllPar,
          )
          .map(entries => new Map(entries) as ReadonlyMap<string, A>),
      ),

    run: sync.zipPar(driver.run).asUnit,
  }
}

export const make = <EOps, EDriver, EMiss, A>({
  driver,
  ops = Stream.empty,
  onMiss,
}: {
  driver: CacheDriver<EDriver, A>
  ops?: Stream<never, EOps, CacheOp<A>>
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

  return {
    ...driver,
    get: (id: string) =>
      driver
        .get(id)
        .someOrElseEffect(() => onMiss(id).tap(a => driver.set(id, a))),
    run: sync.zipPar(driver.run).asUnit,
  }
}

export class CacheMissError {
  readonly _tag = "CacheMissError"
  constructor(readonly cacheName: string, readonly id: string) {}
}