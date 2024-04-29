import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Context from "effect/Context"
import * as Layer from "effect/Layer"

export interface ShardState {
  readonly resumeUrl: string
  readonly sequence: number | null
  readonly sessionId: string
}

export interface ShardStateStore {
  readonly _: unique symbol
}

export interface StateStore {
  readonly get: Effect.Effect<Option.Option<ShardState>>
  readonly set: (state: ShardState) => Effect.Effect<void>
  readonly clear: Effect.Effect<void>
}

export const ShardStateStore = Context.GenericTag<
  ShardStateStore,
  { readonly forShard: (id: [id: number, count: number]) => StateStore }
>("dfx/Shard/StateStore")

export const MemoryShardStateStoreLive = Layer.sync(ShardStateStore, () => {
  const store = new Map<string, ShardState>()

  return ShardStateStore.of({
    forShard: ([id, count]) => {
      const key = `${id}-${count}`
      return {
        get: Effect.sync(() => Option.fromNullable(store.get(key))),
        set(state) {
          return Effect.sync(() => {
            store.set(key, state)
          })
        },
        clear: Effect.sync(() => {
          store.delete(key)
        }),
      }
    },
  })
})
