import { LiveFetchRequestExecutor } from "@effect-http/client"
import { DiscordConfig, LiveDiscordREST, Log } from "dfx"
import { LiveDiscordGateway } from "./DiscordGateway.js"
import { LiveJsonDiscordWSCodec } from "./DiscordGateway/DiscordWS.js"
import { LiveMemoryShardStore } from "./DiscordGateway/ShardStore.js"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "./RateLimit.js"

export * as CachePrelude from "./Cache/prelude.js"
export * as Gateway from "./DiscordGateway.js"
export * as DiscordWS from "./DiscordGateway/DiscordWS.js"
export * as Shard from "./DiscordGateway/Shard.js"
export * as ShardStore from "./DiscordGateway/ShardStore.js"
export * as WS from "./DiscordGateway/WS.js"
export { run as runIx } from "./Interactions/gateway.js"

export const MemoryRateLimit = LiveMemoryRateLimitStore >> LiveRateLimiter

export const MemoryBot =
  (LiveMemoryShardStore + LiveMemoryRateLimitStore + LiveJsonDiscordWSCodec) >>
  ((LiveDiscordREST > LiveDiscordGateway) + MemoryRateLimit)

export const makeLiveWithoutFetch = (
  config: Config.Wrap<DiscordConfig.MakeOpts>,
  debug = false,
) => {
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeFromConfig(Config.unwrap(config))
  const LiveEnv = LiveLog + LiveConfig > MemoryBot

  return LiveEnv
}

export const makeLive = (
  config: Config.Wrap<DiscordConfig.MakeOpts>,
  debug = false,
) => {
  return LiveFetchRequestExecutor >> makeLiveWithoutFetch(config, debug)
}
