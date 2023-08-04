import * as Duration from "@effect/data/Duration"
import * as Option from "@effect/data/Option"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import * as Effect from "@effect/io/Effect"
import { createDriver, createParentDriver } from "dfx/Cache/driver"

export interface MemoryTTLOpts {
  /** The approx. number of milliseconds to keep items */
  readonly ttl: Duration.Duration

  /**
   * How often items should be cleared.
   */
  readonly resolution?: Duration.Duration

  /**
   * What sweep strategy to use.
   *
   * "activity" means the TTL is reset for every `set` OR `get` operation
   * "usage" means the TTL is only reset for the `get` operation
   *
   * Defaults to "usage"
   */
  readonly strategy?: "activity" | "usage" | "expiry"
}

interface CacheItem<T> {
  resource: T
}

interface TTLBucket<T> {
  readonly expires: number
  readonly items: Array<CacheItem<T>>
}

const make = <T>({
  resolution = Duration.minutes(1),
  strategy = "usage",
  ttl,
}: MemoryTTLOpts) => {
  const resolutionMs = Duration.toMillis(resolution)
  const additionalMilliseconds =
    (Math.floor(Duration.toMillis(ttl) / resolutionMs) + 1) * resolutionMs

  const items = new Map<string, WeakRef<CacheItem<T>>>()
  const buckets: Array<TTLBucket<T>> = []

  const refreshTTL = (item: CacheItem<T>) => {
    const now = Date.now()
    const remainder = now % resolutionMs
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
    const remainder = now % resolutionMs
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

    get: resourceId =>
      Effect.sync(
        (): Option.Option<T> => Option.fromNullable(getSync(resourceId)),
      ),

    refreshTTL: id =>
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

    delete: resourceId =>
      Effect.sync(() => {
        items.delete(resourceId)
      }),

    run: Effect.sync(sweep).pipe(
      Effect.delay(Duration.times(resolution, 0.5)),
      Effect.forever,
    ),
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
      sizeForParent: parentId =>
        Effect.sync(() => parentIds.get(parentId)?.size ?? 0),

      refreshTTL: (_, id) => store.refreshTTL(id),

      get: (_, id) => store.get(id),

      getForParent: parentId =>
        Option.fromNullable(parentIds.get(parentId)).pipe(
          Effect.flatMap(ids =>
            Effect.forEach(
              ids,
              id =>
                store.get(id).pipe(
                  Effect.tap(item =>
                    Effect.sync(() => {
                      if (item._tag === "None") {
                        ids.delete(id)
                      }
                    })
                  ),
                  Effect.map(item => [id, item] as const),
                ),
              { concurrency: "unbounded" },
            )
          ),
          Effect.map(
            ReadonlyArray.reduce(
              new Map<string, T>(),
              (acc, [id, item]) =>
                item._tag === "Some" ? acc.set(id, item.value) : acc,
            ),
          ),
          Effect.option,
        ),

      set: (parentId, resourceId, resource) =>
        Effect.zipRight(
          store.set(resourceId, resource),
          Effect.sync(() => {
            if (!parentIds.has(parentId)) {
              parentIds.set(parentId, new Set())
            }
            parentIds.get(parentId)!.add(resourceId)
          }),
        ),

      delete: (parentId, resourceId) =>
        Effect.zipRight(
          store.delete(resourceId),
          Effect.sync(() => {
            parentIds.get(parentId)?.delete(resourceId)
          }),
        ),

      parentDelete: parentId =>
        Effect.suspend(() => {
          const ids = parentIds.get(parentId)
          parentIds.delete(parentId)

          const effects: Array<Effect.Effect<never, never, void>> = []
          if (ids) {
            ids.forEach(id => {
              effects.push(store.delete(id))
            })
          }

          return Effect.all(effects, {
            concurrency: "unbounded",
            discard: true,
          })
        }),

      run: store.run,
    })
  })
