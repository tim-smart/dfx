export interface ClaimIdContext {
  sharderCount: number
  totalCount: number
}

export interface ShardStore {
  claimId: (ctx: ClaimIdContext) => Effect<never, never, Maybe<number>>
  allClaimed: (totalCount: number) => Effect<never, never, boolean>
  heartbeat?: (shardId: number) => Effect<never, never, void>
}
export const ShardStore = Tag<ShardStore>()

// Very basic shard id store, that does no health checks
const memoryStore = (): ShardStore => {
  let currentId = 0

  return {
    claimId: ({ totalCount }) =>
      Effect.sync(() => {
        if (currentId >= totalCount) {
          return Maybe.none()
        }

        const id = currentId
        currentId++
        return Maybe.some(id)
      }),

    allClaimed: (totalCount) => Effect.sync(() => currentId >= totalCount),
  }
}

export const LiveMemoryShardStore = Layer.sync(ShardStore, memoryStore)
