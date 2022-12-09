export * as WS from "./DiscordGateway/WS/index.js"
export * as DiscordWS from "./DiscordGateway/DiscordWS/index.js"
export * as Shard from "./DiscordGateway/Shard/index.js"
export * as ShardStore from "./DiscordGateway/ShardStore/index.js"
export * as Gateway from "./DiscordGateway/index.js"
export * as CacheOps from "./Cache/gateway.js"
export { run as runIx } from "./Interactions/gateway.js"

export const LiveRateLimit =
  RateLimit.LiveMemoryRateLimitStore > RateLimit.LiveRateLimiter

export const LiveREST = LiveRateLimit > LiveDiscordREST

export const LiveGateway =
  ShardStore.LiveMemoryShardStore + DiscordWS.LiveJsonDiscordWSCodec >
  Gateway.LiveDiscordGateway

export const LiveBot = LiveREST > LiveGateway

export const make = (config: Config.MakeOpts, debug = false) => {
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = Config.makeLayer(config)
  const LiveEnv = LiveLog + LiveConfig > LiveBot

  return LiveEnv
}
