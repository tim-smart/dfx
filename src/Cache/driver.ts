export interface ParentCacheStoreDriver<E, T> {
  readonly size: Effect<never, E, number>
  sizeForParent: (parentId: string) => Effect<never, E, number>
  get: (parentId: string, resourceId: string) => Effect<never, E, Maybe<T>>
  getForParent: (
    parentId: string,
  ) => Effect<never, E, Maybe<ReadonlyMap<string, T>>>
  set: (
    parentId: string,
    resourceId: string,
    resource: T,
  ) => Effect<never, E, void>
  delete: (parentId: string, resourceId: string) => Effect<never, E, void>
  parentDelete: (parentId: string) => Effect<never, E, void>
  refreshTTL: (parentId: string, resourceId: string) => Effect<never, E, void>
  readonly run: Effect<never, E, void>
}

export const createParentDriver = <E, T>(
  driver: ParentCacheStoreDriver<E, T>,
) => driver

export interface CacheStoreDriver<E, T> {
  readonly size: Effect<never, E, number>
  get: (resourceId: string) => Effect<never, E, Maybe<T>>
  set: (resourceId: string, resource: T) => Effect<never, E, void>
  delete: (resourceId: string) => Effect<never, E, void>
  refreshTTL: (resourceId: string) => Effect<never, E, void>
  readonly run: Effect<never, E, void>
}

export const createDriver = <E, T>(driver: CacheStoreDriver<E, T>) => driver
