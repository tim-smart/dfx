import { DiscordREST, LiveDiscordREST } from "./DiscordREST"
import * as Shard from "./DiscordShard"
import { LiveDiscordWS } from "./DiscordWS"
import { LiveLog, LiveLogDebug } from "./Log"
import * as WS from "./WS"

const ShardDeps = WS.LiveWS[">+>"](LiveDiscordWS)[">+>"](Shard.LiveDiscordShard)

const DiscordEnv = ShardDeps["+++"](LiveDiscordREST)

export const DebugEnv = DiscordEnv["+++"](LiveLogDebug)
export const DefaultEnv = DiscordEnv["+++"](LiveLog)

export { makeLayer as makeConfigLayer } from "./DiscordConfig"

export { rest } from "./DiscordREST"
