import { LiveFetchRequestExecutor } from "@effect-http/client"
import { LiveDiscordREST } from "./DiscordREST.js"
import { MakeConfigOpts, makeConfigLayer } from "./Interactions/webhook.js"
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
) =>
  Layer.unwrapEffect(
    Config.unwrap(options).config.map(options => {
      const config = DiscordConfig.make(options)
      const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
      const LiveWebhook = makeConfigLayer(options)
      const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
      const LiveEnv =
        (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)
      return LiveEnv
    }),
  )

export const makeLive = (
  config: Config.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
) => LiveFetchRequestExecutor >> makeLiveWithoutFetch(config)

export const makeLiveWithoutConfig = (
  options: DiscordConfig.MakeOpts & MakeConfigOpts,
) => {
  const config = DiscordConfig.make(options)
  const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
  const LiveWebhook = makeConfigLayer(options)
  const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)
  return LiveFetchRequestExecutor >> LiveEnv
}
