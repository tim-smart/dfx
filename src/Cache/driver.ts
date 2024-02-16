import type * as Option from "effect/Option"
import type * as Effect from "effect/Effect"

export interface ParentCacheDriver<E, T> {
  readonly size: Effect.Effect<number, E>
  sizeForParent: (parentId: string) => Effect.Effect<number, E>
  get: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<Option.Option<T>, E>
  getForParent: (
    parentId: string,
  ) => Effect.Effect<Option.Option<ReadonlyMap<string, T>>, E>
  set: (
    parentId: string,
    resourceId: string,
    resource: T,
  ) => Effect.Effect<void, E>
  delete: (parentId: string, resourceId: string) => Effect.Effect<void, E>
  parentDelete: (parentId: string) => Effect.Effect<void, E>
  refreshTTL: (parentId: string, resourceId: string) => Effect.Effect<void, E>
  readonly run: Effect.Effect<never, E>
}

export const createParentDriver = <E, T>(driver: ParentCacheDriver<E, T>) =>
  driver

export interface CacheDriver<E, T> {
  readonly size: Effect.Effect<number, E>
  get: (resourceId: string) => Effect.Effect<Option.Option<T>, E>
  set: (resourceId: string, resource: T) => Effect.Effect<void, E>
  delete: (resourceId: string) => Effect.Effect<void, E>
  refreshTTL: (resourceId: string) => Effect.Effect<void, E>
  readonly run: Effect.Effect<never, E>
}

export const createDriver = <E, T>(driver: CacheDriver<E, T>) => driver
