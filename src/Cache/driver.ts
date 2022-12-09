export interface CacheStoreDriver<
  T,
  ESize = any,
  EPSize = any,
  EGet = any,
  EGetP = any,
  ESet = any,
  EDelete = any,
  EPDelete = any,
  ERefresh = any,
  ERun = any,
> {
  readonly size: Effect<never, ESize, number>
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
  readonly run: Effect<never, ERun, void>
}

export const createDriver = <
  T,
  ESize,
  EPSize,
  EGet,
  EGetP,
  ESet,
  EDelete,
  EPDelete,
  ERefresh,
  ERun,
>(
  driver: CacheStoreDriver<
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
  >,
) => driver

export interface NonParentCacheStoreDriver<
  T,
  ESize = any,
  EGet = any,
  ESet = any,
  EDelete = any,
  ERefresh = any,
  ERun = any,
> {
  readonly size: Effect<never, ESize, number>
  get: (resourceId: string) => Effect<never, EGet, Maybe<T>>
  set: (resourceId: string, resource: T) => Effect<never, ESet, void>
  delete: (resourceId: string) => Effect<never, EDelete, void>
  refreshTTL: (resourceId: string) => Effect<never, ERefresh, void>
  readonly run: Effect<never, ERun, void>
}

export const createNonParentDriver = <
  T,
  ESize,
  EGet,
  ESet,
  EDelete,
  ERefresh,
  ERun,
>(
  driver: NonParentCacheStoreDriver<
    T,
    ESize,
    EGet,
    ESet,
    EDelete,
    ERefresh,
    ERun
  >,
) => driver
