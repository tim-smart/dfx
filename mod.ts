import * as Shard from "./DiscordShard"
import { LiveDiscordWS } from "./DiscordWS"
import { LiveLog } from "./Log"
import * as WS from "./WS"

export const DefaultEnv = WS.LiveWS[">+>"](LiveDiscordWS)
  [">+>"](Shard.LiveDiscordShard)
  ["+++"](LiveLog)
