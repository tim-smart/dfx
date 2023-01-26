import { LiveDiscordREST } from "./DiscordREST/index.js"
import { LiveHttp } from "./Http/index.js"
import {
  MakeConfigOpts,
  makeConfigLayer,
  makeFromConfig as makeConfigFromConfig,
} from "./Interactions/webhook.js"
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
  config: DiscordConfig.MakeOpts & MakeConfigOpts,
  debug = false,
) => {
  const LiveWebhook = makeConfigLayer(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeLayer(config)
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)

  return LiveEnv
}

export const makeFromConfig = (
  options: ConfigWrap.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
  debug = false,
) => {
  const config = ConfigWrap.unwrap(options)

  const LiveWebhook = makeConfigFromConfig(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = DiscordConfig.makeFromConfig(config)
  const LiveEnv =
    (LiveLog + LiveConfig) >> (MemoryREST + LiveWebhook + MemoryRateLimit)

  return LiveEnv
}
