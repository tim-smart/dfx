import { CacheDriver, ParentCacheDriver } from "./driver.js"

export * from "./driver.js"
export {
  create as memoryDriver,
  createWithParent as memoryParentDriver,
} from "./memory.js"
export {
  create as memoryTTLDriver,
  createWithParent as memoryTTLParentDriver,
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

export const makeParent = <
  RMakeDriver,
  RPMiss,
  EOps,
  EMakeDriver,
  EDriver,
  EMiss,
  EPMiss,
  A,
>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
  onParentMiss,
}: {
  driver: Effect<RMakeDriver, EMakeDriver, ParentCacheDriver<EDriver, A>>
  ops?: EffectSource<never, EOps, ParentCacheOp<A>>
  onMiss: (parentId: string, id: string) => Effect<never, EMiss, A>
  onParentMiss: (
    parentId: string,
  ) => Effect<RPMiss, EPMiss, [id: string, resource: A][]>
}) =>
  Do(($) => {
    const driver = $(makeDriver)

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
            .map((entries) => new Map(entries) as ReadonlyMap<string, A>),
        ),

      run: sync.zipPar(driver.run).asUnit,
    }
  })

export const make = <RMakeDriver, EOps, EMakeDriver, EDriver, EMiss, A>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
}: {
  driver: Effect<RMakeDriver, EMakeDriver, CacheDriver<EDriver, A>>
  ops?: EffectSource<never, EOps, CacheOp<A>>
  onMiss: (id: string) => Effect<never, EMiss, A>
}) =>
  Do(($) => {
    const driver = $(makeDriver)

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
          .someOrElseEffect(() => onMiss(id).tap((a) => driver.set(id, a))),
      run: sync.zipPar(driver.run).asUnit,
    }
  })

export class CacheMissError {
  readonly _tag = "CacheMissError"
  constructor(readonly cacheName: string, readonly id: string) {}
}
