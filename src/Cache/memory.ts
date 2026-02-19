import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import type { CacheDriver, ParentCacheDriver } from "./driver.ts"
import { createDriver, createParentDriver } from "./driver.ts"

export const createWithParent = <T>(): Effect.Effect<
  ParentCacheDriver<never, T>
> =>
  Effect.sync(() => {
    const map = new Map<string, Map<string, T>>()

    return createParentDriver({
      size: Effect.sync(() => {
        let count = 0
        for (const a of map.values()) {
          count += a.size
        }
        return count
      }),

      sizeForParent: parentId =>
        Effect.sync(() => map.get(parentId)?.size ?? 0),

      get: (parentId, resourceId) =>
        Effect.sync(
          (): Option.Option<T> =>
            Option.fromNullishOr(map.get(parentId)?.get(resourceId)),
        ),

      getForParent: parentId =>
        Effect.sync(() => Option.fromNullishOr(map.get(parentId))),

      set: (parentId, resourceId, resource) =>
        Effect.sync(() => {
          if (!map.has(parentId)) {
            map.set(parentId, new Map())
          }
          map.get(parentId)!.set(resourceId, resource)
        }),

      delete: (parentId, resourceId) =>
        Effect.sync(() => {
          map.get(parentId)?.delete(resourceId)
        }),

      parentDelete: parentId =>
        Effect.sync(() => {
          map.delete(parentId)
        }),

      refreshTTL: () => Effect.void,

      run: Effect.never,
    })
  })

export const create = <T>(): Effect.Effect<CacheDriver<never, T>> =>
  Effect.sync(() => {
    const map = new Map<string, T>()

    return createDriver({
      size: Effect.sync(() => map.size),

      get: resourceId =>
        Effect.sync(
          (): Option.Option<T> => Option.fromNullishOr(map.get(resourceId)),
        ),

      set: (resourceId, resource) =>
        Effect.sync(() => {
          map.set(resourceId, resource)
        }),

      delete: resourceId =>
        Effect.sync(() => {
          map.delete(resourceId)
        }),

      refreshTTL: () => Effect.void,

      run: Effect.never,
    })
  })
