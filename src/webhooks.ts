import { LiveHttp } from "./Http/index.js"
import { makeConfigLayer, MakeConfigOpts } from "./Interactions/webhook.js"

export {
  makeConfigLayer,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  WebhookParseError,
  BadWebhookSignature,
} from "./Interactions/webhook.js"

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
