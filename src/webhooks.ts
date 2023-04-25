import { LiveFetchRequestExecutor } from "@effect-http/client"
import { LiveDiscordREST } from "./DiscordREST.js"
import { MakeConfigOpts, makeFromConfig } from "./Interactions/webhook.js"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "./RateLimit.js"
import * as DiscordConfig from "dfx/DiscordConfig"
import * as Log from "./Log.js"

export {
  BadWebhookSignature,
  makeConfigLayer,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  WebhookParseError,
} from "./Interactions/webhook.js"

export const MemoryRateLimit = LiveMemoryRateLimitStore >> LiveRateLimiter

export const MemoryREST = LiveMemoryRateLimitStore >> LiveDiscordREST

export const makeLiveWithoutFetch = (
  options: Config.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
  debug = false,
) => {
  const config = Config.unwrap(options)

  const LiveWebhook = makeFromConfig(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeFromConfig(config)
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)

  return LiveEnv
}

export const makeLive = (
  config: Config.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
  debug = false,
) => {
  return LiveFetchRequestExecutor >> makeLiveWithoutFetch(config, debug)
}
