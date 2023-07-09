import * as Effect from "@effect/io/Effect"
import * as Option from "@effect/data/Option"

export interface ParentCacheDriver<E, T> {
  readonly size: Effect.Effect<never, E, number>
  sizeForParent: (parentId: string) => Effect.Effect<never, E, number>
  get: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<never, E, Option.Option<T>>
  getForParent: (
    parentId: string,
  ) => Effect.Effect<never, E, Option.Option<ReadonlyMap<string, T>>>
  set: (
    parentId: string,
    resourceId: string,
    resource: T,
  ) => Effect.Effect<never, E, void>
  delete: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<never, E, void>
  parentDelete: (parentId: string) => Effect.Effect<never, E, void>
  refreshTTL: (
    parentId: string,
    resourceId: string,
  ) => Effect.Effect<never, E, void>
  readonly run: Effect.Effect<never, E, never>
}

export const createParentDriver = <E, T>(driver: ParentCacheDriver<E, T>) =>
  driver

export interface CacheDriver<E, T> {
  readonly size: Effect.Effect<never, E, number>
  get: (resourceId: string) => Effect.Effect<never, E, Option.Option<T>>
  set: (resourceId: string, resource: T) => Effect.Effect<never, E, void>
  delete: (resourceId: string) => Effect.Effect<never, E, void>
  refreshTTL: (resourceId: string) => Effect.Effect<never, E, void>
  readonly run: Effect.Effect<never, E, never>
}

export const createDriver = <E, T>(driver: CacheDriver<E, T>) => driver
