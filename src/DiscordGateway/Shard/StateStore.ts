import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Context from "effect/Context"
import * as Layer from "effect/Layer"
import * as KVS from "@effect/platform/KeyValueStore"

export interface ShardState {
  readonly resumeUrl: string
  readonly sequence: number | null
  readonly sessionId: string
}

export interface StateStore {
  readonly get: Effect.Effect<Option.Option<ShardState>>
  readonly set: (state: ShardState) => Effect.Effect<void>
  readonly clear: Effect.Effect<void>
}

export class ShardStateStore extends Context.Tag("dfx/Shard/StateStore")<
  ShardStateStore,
  { readonly forShard: (id: [id: number, count: number]) => StateStore }
>() {
  static MemoryLive: Layer.Layer<ShardStateStore> = Layer.sync(
    ShardStateStore,
    () => {
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
    },
  )

  static KVSLive: Layer.Layer<ShardStateStore, never, KVS.KeyValueStore> =
    Layer.effect(
      ShardStateStore,
      Effect.gen(function* (_) {
        const store = yield* KVS.KeyValueStore
        return ShardStateStore.of({
          forShard([id, count]) {
            const key = `dfx-shard-state-${id}-${count}`
            return {
              get: Effect.map(
                Effect.orDie(store.get(key)),
                Option.map(JSON.parse),
              ),
              set: state => Effect.orDie(store.set(key, JSON.stringify(state))),
              clear: Effect.orDie(store.remove(key)),
            }
          },
        })
      }),
    )
}
