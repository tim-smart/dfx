import { DiscordConfig, LiveDiscordREST, Log } from "dfx"
import { LiveJsonDiscordWSCodec } from "./DiscordGateway/DiscordWS.js"
import { LiveDiscordGateway } from "./DiscordGateway.js"
import { LiveSharder } from "./DiscordGateway/Sharder.js"
import { LiveMemoryShardStore } from "./DiscordGateway/ShardStore.js"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "./RateLimit.js"

export * as CachePrelude from "./Cache/prelude.js"
export * as DiscordWS from "./DiscordGateway/DiscordWS.js"
export * as Gateway from "./DiscordGateway.js"
export * as Shard from "./DiscordGateway/Shard.js"
export * as ShardStore from "./DiscordGateway/ShardStore.js"
export * as WS from "./DiscordGateway/WS.js"
export { run as runIx } from "./Interactions/gateway.js"

export const MemoryRateLimit = LiveMemoryRateLimitStore > LiveRateLimiter

export const MemoryREST = MemoryRateLimit >> LiveDiscordREST

export const MemorySharder =
  (MemoryREST +
    LiveMemoryShardStore +
    MemoryRateLimit +
    LiveJsonDiscordWSCodec) >>
  LiveSharder

export const MemoryGateway = MemorySharder >> LiveDiscordGateway

export const MemoryBot = MemoryREST > MemoryGateway + MemoryRateLimit

export const make = (config: DiscordConfig.MakeOpts, debug = false) => {
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeLayer(config)
  const LiveEnv = LiveLog + LiveConfig > MemoryBot

  return LiveEnv
}

export const makeFromConfig = (
  config: ConfigWrap.Wrap<DiscordConfig.MakeOpts>,
  debug = false,
) => {
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeFromConfig(ConfigWrap.unwrap(config))
  const LiveEnv = LiveLog + LiveConfig > MemoryBot

  return LiveEnv
}
