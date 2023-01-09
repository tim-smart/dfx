import { LiveDiscordREST } from "./DiscordREST/index.js"
import { LiveHttp } from "./Http/index.js"
import { MakeConfigOpts, makeFromConfig } from "./Interactions/webhook.js"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "./RateLimit/index.js"

export {
  BadWebhookSignature,
  makeConfigLayer,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  WebhookParseError,
} from "./Interactions/webhook.js"

export const MemoryRateLimit = LiveMemoryRateLimitStore > LiveRateLimiter

export const MemoryREST = (MemoryRateLimit + LiveHttp) >> LiveDiscordREST

export const make = (
  config: Config<DiscordConfig.MakeOpts & MakeConfigOpts>,
  debug = false,
) => {
  const LiveWebhook = makeFromConfig(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeFromConfig(config)
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)

  return LiveEnv
}
