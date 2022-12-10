import { ParentCacheStoreDriver, CacheStoreDriver } from "./driver.js"

export * from "./driver.js"

export {
  createWithParent as memoryDriver,
  create as nonParentMemoryDriver,
} from "./memory.js"

export {
  createWithParent as memoryTTLDriver,
  create as nonParentMemoryTTLDriver,
} from "./memoryTTL.js"

export type ParentCacheOp<T> =
  | { op: "create"; parentId: string; resourceId: string; resource: T }
  | { op: "update"; parentId: string; resourceId: string; resource: T }
  | { op: "delete"; parentId: string; resourceId: string }
  | { op: "parentDelete"; parentId: string }

export type CacheOp<T> =
  | { op: "create"; resourceId: string; resource: T }
  | { op: "update"; resourceId: string; resource: T }
  | { op: "delete"; resourceId: string }

export class CacheMissError {
  readonly _tag = "CacheMissError"
}

export const make = <T, R, E, RMD, EMD, ED, RM, EM, RPM, EPM>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
  onParentMiss,
}: {
  driver: Effect<RMD, EMD, ParentCacheStoreDriver<ED, T>>
  ops?: EffectSource<R, E, ParentCacheOp<T>>
  onMiss: (parentId: string, id: string) => Effect<RM, EM, T>
  onParentMiss: (
    parentId: string,
  ) => Effect<RPM, EPM, [id: string, resource: T][]>
}) =>
  Do(($) => {
    const driver = $(makeDriver)

    const sync = ops.tap((op): Effect<never, ED, void> => {
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
            onMiss(parentId, id).tap((a) => driver.set(parentId, id, a)),
          ),

      getForParent: (parentId: string) =>
        driver.getForParent(parentId).someOrElseEffect(() =>
          onParentMiss(parentId)
            .tap(
              (entries) =>
                entries.map(([id, a]) => driver.set(parentId, id, a))
                  .collectAllPar,
            )
            .map((entries) => new Map(entries) as ReadonlyMap<string, T>),
        ),

      run: sync.zipPar(driver.run).asUnit,
    }
  })

export const makeNonParent = <T, R, E, RMD, EMD, ED, RM, EM>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
}: {
  driver: Effect<RMD, EMD, CacheStoreDriver<ED, T>>
  ops?: EffectSource<R, E, CacheOp<T>>
  onMiss: (id: string) => Effect<RM, EM, T>
}) =>
  Do(($) => {
    const driver = $(makeDriver)

    const sync = ops.tap((op): Effect<never, ED, void> => {
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
          .someOrElseEffect(() => onMiss(id).tap((a) => driver.set(id, a))),
      run: sync.zipPar(driver.run).asUnit,
    }
  })
