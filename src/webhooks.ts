export * as Discord from "./types.js"

export * as Config from "./DiscordConfig/index.js"
export { DiscordREST, LiveDiscordREST, rest } from "./DiscordREST/index.js"
export * as Ix from "./Interactions/index.js"
export * as Log from "./Log/index.js"
export * as RateLimitStore from "./RateLimitStore/index.js"

export * as Flags from "./Helpers/flags.js"
export * as IxHelpers from "./Helpers/interactions.js"
export * as Members from "./Helpers/members.js"
export * as Perms from "./Helpers/permissions.js"
export * as UI from "./Helpers/ui.js"

export const LiveRateLimit =
  RateLimitStore.LiveMemoryRateLimitStore > RateLimitStore.LiveRateLimiter

export const LiveREST = LiveRateLimit > Rest.LiveDiscordREST

export const makeLayer = (
  config: Config.MakeOpts & Ix.WebhookConfig,
  debug = false,
) => {
  const LiveWebhook = Ix.makeWebhookConfig(config)
  const LiveLog = debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveConfig = Config.makeLayer(config)
  const LiveEnv = LiveLog + LiveConfig + LiveWebhook > LiveREST

  return LiveEnv
}
