import { LiveJsonDiscordWSCodec } from "./DiscordGateway/DiscordWS/index.js"
import { LiveSharder } from "./DiscordGateway/Sharder/index.js"
import { LiveMemoryShardStore } from "./DiscordGateway/ShardStore/index.js"
import { LiveHttp } from "./Http/index.js"

export * as WS from "./DiscordGateway/WS/index.js"
export * as DiscordWS from "./DiscordGateway/DiscordWS/index.js"
export * as Shard from "./DiscordGateway/Shard/index.js"
export * as ShardStore from "./DiscordGateway/ShardStore/index.js"
export * as Gateway from "./DiscordGateway/index.js"
export * as CacheOps from "./Cache/gateway.js"
export * as CachePrelude from "./Cache/prelude.js"
export { run as runIx } from "./Interactions/gateway.js"

export const MemoryRateLimit =
  RateLimit.LiveMemoryRateLimitStore > RateLimit.LiveRateLimiter

export const MemoryREST = (LiveHttp + MemoryRateLimit) >> LiveDiscordREST

export const MemorySharder =
  (MemoryREST +
    LiveMemoryShardStore +
    MemoryRateLimit +
    LiveJsonDiscordWSCodec) >>
  LiveSharder

export const MemoryGateway = MemorySharder >> Gateway.LiveDiscordGateway

export const MemoryBot = MemoryREST > MemoryGateway + MemoryRateLimit

export const make = (config: Config.MakeOpts, debug = false) => {
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = Config.makeLayer(config)
  const LiveEnv = LiveLog + LiveConfig > MemoryBot

  return LiveEnv
}
