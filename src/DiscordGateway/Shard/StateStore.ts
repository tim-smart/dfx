import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as Layer from "effect/Layer"
import * as ServiceMap from "effect/ServiceMap"
import * as KeyValueStore from "effect/unstable/persistence/KeyValueStore"
import { flow, pipe } from "effect/Function"

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

export class ShardStateStore extends ServiceMap.Service<
  ShardStateStore,
  { readonly forShard: (id: [id: number, count: number]) => StateStore }
>()("dfx/Shard/StateStore") {
  static MemoryLive: Layer.Layer<ShardStateStore> = Layer.sync(
    ShardStateStore,
    () => {
      const store = new Map<string, ShardState>()

      return ShardStateStore.of({
        forShard: ([id, count]) => {
          const key = `${id}-${count}`
          return {
            get: Effect.sync(() => Option.fromUndefinedOr(store.get(key))),
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

  static KVSLive: Layer.Layer<
    ShardStateStore,
    never,
    KeyValueStore.KeyValueStore
  > = Layer.effect(
    ShardStateStore,
    Effect.gen(function* () {
      const store = yield* KeyValueStore.KeyValueStore
      return ShardStateStore.of({
        forShard([id, count]) {
          const key = `dfx-shard-state-${id}-${count}`
          return {
            get: pipe(
              store.get(key),
              Effect.orDie,
              Effect.map(flow(Option.fromUndefinedOr, Option.map(JSON.parse))),
            ),
            set: state => Effect.orDie(store.set(key, JSON.stringify(state))),
            clear: Effect.orDie(store.remove(key)),
          }
        },
      })
    }),
  )
}
