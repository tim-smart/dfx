import { LiveDiscordGateway } from "./DiscordGateway"
import { LiveDiscordREST } from "./DiscordREST"
import { LiveDiscordWS } from "./DiscordGateway/DiscordWS"
import { LiveLog, LiveLogDebug } from "./Log"
import { LiveShard } from "./DiscordGateway/Shard"
import { LiveMemoryShardStore } from "./DiscordGateway/ShardStore"
import { LiveWS } from "./DiscordGateway/WS"
import { LiveMemoryRateLimitStore } from "./RateLimitStore"

const GatewayEnv = LiveWS[">+>"](LiveDiscordWS)
  [">+>"](LiveShard)
  [">+>"](LiveMemoryShardStore)
  [">+>"](LiveDiscordGateway)

const DiscordEnv = GatewayEnv["+++"](LiveDiscordREST)["+++"](
  LiveMemoryRateLimitStore,
)

export const DebugEnv = DiscordEnv["+++"](LiveLogDebug)
export const DefaultEnv = DiscordEnv["+++"](LiveLog)

export { makeLayer as makeConfigLayer } from "./DiscordConfig"
export { gateway, fromDispatch } from "./DiscordGateway"
export { rest } from "./DiscordREST"
