import { LiveDiscordGateway } from "./DiscordGateway"
import { LiveDiscordREST } from "./DiscordREST"
import * as Shard from "./DiscordShard"
import { LiveDiscordWS } from "./DiscordWS"
import { LiveLog, LiveLogDebug } from "./Log"
import * as WS from "./WS"

const GatewayEnv = WS.LiveWS[">+>"](LiveDiscordWS)
  [">+>"](Shard.LiveDiscordShard)
  [">+>"](LiveDiscordGateway)

const DiscordEnv = GatewayEnv["+++"](LiveDiscordREST)

export const DebugEnv = DiscordEnv["+++"](LiveLogDebug)
export const DefaultEnv = DiscordEnv["+++"](LiveLog)

export { makeLayer as makeConfigLayer } from "./DiscordConfig"
export { gateway, fromDispatch, run } from "./DiscordGateway"
export { rest, call as callRest } from "./DiscordREST"
