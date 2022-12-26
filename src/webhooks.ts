import { Config, Log } from "dfx"
import { LiveDiscordREST } from "./DiscordREST/index.js"
import { LiveHttp } from "./Http/index.js"
import { makeConfigLayer, MakeConfigOpts } from "./Interactions/webhook.js"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "./RateLimit/index.js"
import { Layer } from "./_common.js"

export {
  BadWebhookSignature,
  makeConfigLayer,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  WebhookParseError,
} from "./Interactions/webhook.js"

const _layer = Layer.LayerTypeId

export const MemoryRateLimit = LiveMemoryRateLimitStore > LiveRateLimiter

export const MemoryREST = (MemoryRateLimit + LiveHttp) >> LiveDiscordREST

export const make = (
  config: Config.MakeOpts & MakeConfigOpts,
  debug = false,
) => {
  const LiveWebhook = makeConfigLayer(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = Config.makeLayer(config)
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)

  return LiveEnv
}
