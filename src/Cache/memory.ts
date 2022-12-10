import { createParentDriver, createDriver } from "./driver.js"

export const createWithParent = <T>() =>
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

      sizeForParent: (parentId) =>
        Effect.sync(() => map.get(parentId)?.size ?? 0),

      get: (parentId, resourceId) =>
        Effect.sync(
          (): Maybe<T> =>
            Maybe.fromNullable(map.get(parentId)?.get(resourceId)),
        ),

      getForParent: (parentId) =>
        Effect.sync(() => Maybe.fromNullable(map.get(parentId))),

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

      parentDelete: (parentId) =>
        Effect.sync(() => {
          map.delete(parentId)
        }),

      refreshTTL: () => Effect.unit(),

      run: Effect.unit(),
    })
  })

export const create = <T>() =>
  Effect.sync(() => {
    const map = new Map<string, T>()

    return createDriver({
      size: Effect.sync(() => map.size),

      get: (resourceId) =>
        Effect.sync((): Maybe<T> => Maybe.fromNullable(map.get(resourceId))),

      set: (resourceId, resource) =>
        Effect.sync(() => {
          map.set(resourceId, resource)
        }),

      delete: (resourceId) =>
        Effect.sync(() => {
          map.delete(resourceId)
        }),

      refreshTTL: () => Effect.unit(),

      run: Effect.unit(),
    })
  })
