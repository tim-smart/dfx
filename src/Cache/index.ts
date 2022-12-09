import { CacheStoreDriver, NonParentCacheStoreDriver } from "./driver.js"

export * from "./driver.js"

export {
  create as memoryDriver,
  nonParent as nonParentMemoryDriver,
} from "./memory.js"

export {
  create as memoryTTLDriver,
  createNonParent as nonParentMemoryTTLDriver,
} from "./memoryTTL.js"

export type CacheOp<T> =
  | { op: "create"; parentId: string; resourceId: string; resource: T }
  | { op: "update"; parentId: string; resourceId: string; resource: T }
  | { op: "delete"; parentId: string; resourceId: string }
  | { op: "parentDelete"; parentId: string }

export type NonParentCacheOp<T> =
  | { op: "create"; resourceId: string; resource: T }
  | { op: "update"; resourceId: string; resource: T }
  | { op: "delete"; resourceId: string }

export class CacheMissError {
  readonly _tag = "CacheMissError"
}

export interface Cache<
  T,
  R,
  E,
  ESize,
  EPSize,
  EGet,
  EGetP,
  ESet,
  EDelete,
  EPDelete,
  ERefresh,
  ERun,
> {
  run: Effect<R, E | ESet | EDelete | EPDelete | ERun, void>
  size: Effect<never, ESize, number>
  sizeForParent: (parentId: string) => Effect<never, EPSize, number>
  get: (parentId: string, resourceId: string) => Effect<never, EGet, Maybe<T>>
  getForParent: (
    parentId: string,
  ) => Effect<never, EGetP, Maybe<ReadonlyMap<string, T>>>
  set: (
    parentId: string,
    resourceId: string,
    resource: T,
  ) => Effect<never, ESet, void>
  delete: (parentId: string, resourceId: string) => Effect<never, EDelete, void>
  parentDelete: (parentId: string) => Effect<never, EPDelete, void>
  refreshTTL: (
    parentId: string,
    resourceId: string,
  ) => Effect<never, ERefresh, void>
}

export const make = <
  T,
  R,
  E,
  RD,
  ED,
  RM,
  EM,
  RPM,
  EPM,
  ESize,
  EPSize,
  EGet,
  EGetP,
  ESet,
  EDelete,
  EPDelete,
  ERefresh,
  ERun,
>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
  onParentMiss,
}: {
  driver: Effect<
    RD,
    ED,
    CacheStoreDriver<
      T,
      ESize,
      EPSize,
      EGet,
      EGetP,
      ESet,
      EDelete,
      EPDelete,
      ERefresh,
      ERun
    >
  >
  ops?: EffectSource<R, E, CacheOp<T>>
  onMiss: (parentId: string, id: string) => Effect<RM, EM, T>
  onParentMiss: (
    parentId: string,
  ) => Effect<RPM, EPM, [id: string, resource: T][]>
}) => {
  const make = Do(($) => {
    const driver = $(makeDriver)

    const sync = ops.tap(
      (op): Effect<never, ESet | EDelete | EPDelete, void> => {
        switch (op.op) {
          case "create":
          case "update":
            return driver.set(op.parentId, op.resourceId, op.resource)

          case "delete":
            return driver.delete(op.parentId, op.resourceId)

          case "parentDelete":
            return driver.parentDelete(op.parentId)
        }
      },
    ).runDrain

    return {
      ...driver,
      run: sync.zipPar(driver.run).asUnit,
    }
  })

  const tag =
    Tag<
      Cache<
        T,
        R,
        E,
        ESize,
        EPSize,
        EGet,
        EGetP,
        ESet,
        EDelete,
        EPDelete,
        ERefresh,
        ERun
      >
    >()

  const Layer = make.toLayer(tag)

  return {
    Layer,
    Tag: tag,

    size: Effect.serviceWithEffect(tag)((s) => s.size),
    sizeForParent: (parentId: string) =>
      Effect.serviceWithEffect(tag)((s) => s.sizeForParent(parentId)),

    get: (parentId: string, id: string) =>
      Effect.serviceWithEffect(tag)((s) =>
        s
          .get(parentId, id)
          .someOrElseEffect(() =>
            onMiss(parentId, id).tap((a) => s.set(parentId, id, a)),
          ),
      ),

    getForParent: (parentId: string) =>
      Effect.serviceWithEffect(tag)((s) =>
        s.getForParent(parentId).someOrElseEffect(() =>
          onParentMiss(parentId)
            .tap(
              (entries) =>
                entries.map(([id, a]) => s.set(parentId, id, a)).collectAllPar,
            )
            .map((entries) => new Map(entries) as ReadonlyMap<string, T>),
        ),
      ),

    set: (parentId: string, id: string, resource: T) =>
      Effect.serviceWithEffect(tag)((s) => s.set(parentId, id, resource)),
    delete: (parentId: string, id: string) =>
      Effect.serviceWithEffect(tag)((s) => s.delete(parentId, id)),
    deleteParent: (parentId: string) =>
      Effect.serviceWithEffect(tag)((s) => s.parentDelete(parentId)),
    refreshTTL: (parentId: string, id: string) =>
      Effect.serviceWithEffect(tag)((s) => s.refreshTTL(parentId, id)),
    run: Effect.serviceWithEffect(tag)((s) => s.run),
  }
}

export interface NonParentCache<
  T,
  R,
  E,
  ESize,
  EGet,
  ESet,
  EDelete,
  ERefresh,
  ERun,
> {
  run: Effect<R, E | ESet | EDelete | ERun, void>
  size: Effect<never, ESize, number>
  get: (resourceId: string) => Effect<never, EGet, Maybe<T>>
  set: (resourceId: string, resource: T) => Effect<never, ESet, void>
  delete: (resourceId: string) => Effect<never, EDelete, void>
  refreshTTL: (resourceId: string) => Effect<never, ERefresh, void>
}

export const makeNonParent = <
  T,
  R,
  E,
  RD,
  ED,
  RM,
  EM,
  ESize,
  EGet,
  ESet,
  EDelete,
  ERefresh,
  ERun,
>({
  driver: makeDriver,
  ops = EffectSource.empty,
  onMiss,
}: {
  driver: Effect<
    RD,
    ED,
    NonParentCacheStoreDriver<T, ESize, EGet, ESet, EDelete, ERefresh, ERun>
  >
  ops?: EffectSource<R, E, NonParentCacheOp<T>>
  onMiss: (id: string) => Effect<RM, EM, T>
}) => {
  const make = Do(($) => {
    const driver = $(makeDriver)

    const sync = ops.tap((op): Effect<never, ESet | EDelete, void> => {
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
      run: sync.zipPar(driver.run).asUnit,
    }
  })

  const tag =
    Tag<NonParentCache<T, R, E, ESize, EGet, ESet, EDelete, ERefresh, ERun>>()

  return {
    Layer: make.toLayer(tag),
    Tag: tag,
    size: Effect.serviceWithEffect(tag)((s) => s.size),
    get: (id: string) =>
      Effect.serviceWithEffect(tag)((s) =>
        s.get(id).someOrElseEffect(() => onMiss(id).tap((a) => s.set(id, a))),
      ),
    set: (id: string, resource: T) =>
      Effect.serviceWithEffect(tag)((s) => s.set(id, resource)),
    delete: (id: string) => Effect.serviceWithEffect(tag)((s) => s.delete(id)),
    refreshTTL: (id: string) =>
      Effect.serviceWithEffect(tag)((s) => s.refreshTTL(id)),
    run: Effect.serviceWithEffect(tag)((s) => s.run),
  }
}
