import * as Shard from "./DiscordShard"
import { LiveDiscordWS } from "./DiscordWS"
import { LiveLog, LiveLogDebug } from "./Log"
import * as WS from "./WS"

export const ShardDeps = WS.LiveWS[">+>"](LiveDiscordWS)[">+>"](
  Shard.LiveDiscordShard
)

export const DefaultEnv = ShardDeps["+++"](LiveLog)
export const DebugEnv = ShardDeps["+++"](LiveLogDebug)
