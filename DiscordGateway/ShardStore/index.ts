import { Effect as T, Option as O } from "@effect-ts/core"
import { tag } from "@effect-ts/system/Has"
import * as L from "@effect-ts/system/Layer"

export interface ClaimIdContext {
  sharderCount: number
  totalCount: number
}

export interface ShardStore {
  _tag: "DiscordShardStore"
  claimId: <R = unknown>(ctx: ClaimIdContext) => T.RIO<R, O.Option<number>>
  allClaimed: <R = unknown>(totalCount: number) => T.RIO<R, boolean>
  heartbeat?: <R = unknown>(shardId: number) => T.RIO<R, void>
}
export const ShardStore = tag<ShardStore>()

// Very basic shard id store, that does no health checks
const memoryStore = (): ShardStore => {
  let currentId = 0

  return {
    _tag: "DiscordShardStore",
    claimId: ({ totalCount }) =>
      T.succeedWith(() => {
        if (currentId >= totalCount) return O.none
        const id = currentId
        currentId++
        return O.some(id)
      }),

    allClaimed: (totalCount) => T.succeedWith(() => currentId >= totalCount),
  }
}

export const LiveMemoryShardStore = L.fromFunction(ShardStore)(memoryStore)

export const { allClaimed, claimId } = T.deriveLifted(ShardStore)(
  ["allClaimed", "claimId"],
  [],
  [],
)
