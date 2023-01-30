import { createDriver, createParentDriver } from "./driver.js"

export interface MemoryTTLOpts {
  /** The approx. number of milliseconds to keep items */
  ttl: Duration

  /**
   * How often items should be cleared.
   */
  resolution?: Duration

  /**
   * What sweep strategy to use.
   *
   * "activity" means the TTL is reset for every `set` OR `get` operation
   * "usage" means the TTL is only reset for the `get` operation
   *
   * Defaults to "usage"
   */
  strategy?: "activity" | "usage" | "expiry"
}

interface CacheItem<T> {
  resource: T
}

interface TTLBucket<T> {
  expires: number
  items: CacheItem<T>[]
}

const make = <T>({
  ttl,
  resolution = Duration.minutes(1),
  strategy = "usage",
}: MemoryTTLOpts) => {
  const additionalMilliseconds =
    (Math.floor(ttl.millis / resolution.millis) + 1) * resolution.millis

  const items = new Map<string, WeakRef<CacheItem<T>>>()
  const buckets: TTLBucket<T>[] = []

  const refreshTTL = (item: CacheItem<T>) => {
    const now = Date.now()
    const remainder = now % resolution.millis
    const expires = now - remainder + additionalMilliseconds
    let currentBucket = buckets[buckets.length - 1]

    if ((currentBucket?.expires || 0) < expires) {
      currentBucket = {
        expires,
        items: [],
      }
      buckets.push(currentBucket)
    }

    currentBucket.items.push(item)
  }

  const sweep = () => {
    const now = Date.now()
    const remainder = now % resolution.millis
    const currentExpires = now - remainder

    while (buckets.length && buckets[0].expires <= currentExpires) {
      buckets.shift()!
    }

    if (global.gc) {
      global.gc()
    }
  }

  const getSync = (resourceId: string) => {
    const ref = items.get(resourceId)
    if (!ref) return undefined

    const item = ref.deref()
    if (!item) {
      items.delete(resourceId)
      return undefined
    }

    if (strategy !== "expiry") {
      refreshTTL(item)
    }

    return item.resource
  }

  return createDriver({
    size: Effect.sync(() => items.size),

    get: (resourceId) =>
      Effect.sync((): Maybe<T> => Maybe.fromNullable(getSync(resourceId))),

    refreshTTL: (id) =>
      Effect.sync(() => {
        getSync(id)
      }),

    set: (resourceId, resource) =>
      Effect.sync(() => {
        const item = items.get(resourceId)?.deref()

        if (item && strategy !== "activity") {
          item.resource = resource
        } else {
          const newItem = { resource }
          refreshTTL(newItem)
          items.set(resourceId, new WeakRef(newItem))
        }
      }),

    delete: (resourceId) =>
      Effect.sync(() => {
        items.delete(resourceId)
      }),

    run: Effect.sync(sweep).delay(resolution * 0.5).forever,
  })
}

export const create = <T>(opts: MemoryTTLOpts) =>
  Effect.sync(() => make<T>(opts))

export const createWithParent = <T>(opts: MemoryTTLOpts) =>
  Effect.sync(() => {
    const store = make<T>(opts)
    const parentIds = new Map<string, Set<string>>()

    return createParentDriver({
      size: store.size,
      sizeForParent: (parentId) =>
        Effect.sync(() => parentIds.get(parentId)?.size ?? 0),

      refreshTTL: (_, id) => store.refreshTTL(id),

      get: (_, id) => store.get(id),

      getForParent: (parentId) =>
        Do(($) => {
          const ids = parentIds.get(parentId)
          if (!ids) return Maybe.none()

          const toGet: Effect<never, never, readonly [string, Maybe<T>]>[] = []
          ids.forEach((id) => {
            toGet.push(
              Do(($) => {
                const item = $(store.get(id))
                if (item._tag === "None") {
                  parentIds.delete(id)
                }
                return [id, item] as const
              }),
            )
          })

          const results = $(toGet.collectAllPar)
          const map = results.reduce(new Map<string, T>(), (map, [id, a]) =>
            a._tag === "Some" ? map.set(id, a.value) : map,
          )

          return Maybe.some(map)
        }),

      set: (parentId, resourceId, resource) =>
        Do(($) => {
          $(store.set(resourceId, resource))

          if (!parentIds.has(parentId)) {
            parentIds.set(parentId, new Set())
          }
          parentIds.get(parentId)!.add(resourceId)
        }),

      delete: (parentId, resourceId) =>
        Do(($) => {
          $(store.delete(resourceId))
          parentIds.get(parentId)?.delete(resourceId)
        }),

      parentDelete: (parentId) =>
        Do(($) => {
          const ids = parentIds.get(parentId)
          parentIds.delete(parentId)

          const effects: Effect<never, never, void>[] = []
          if (ids) {
            ids.forEach((id) => {
              effects.push(store.delete(id))
            })
          }

          $(effects.collectAllParDiscard)
        }),

      run: store.run,
    })
  })
