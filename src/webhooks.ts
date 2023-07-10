import type { HttpRequestExecutor } from "@effect-http/client"
import { LiveFetchRequestExecutor } from "@effect-http/client"
import * as Config from "@effect/io/Config"
import type * as ConfigError from "@effect/io/Config/Error"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import * as DiscordConfig from "dfx/DiscordConfig"
import type { DiscordREST } from "dfx/DiscordREST"
import { LiveDiscordREST } from "dfx/DiscordREST"
import type { MakeConfigOpts, WebhookConfig } from "dfx/Interactions/webhook"
import { makeConfigLayer } from "dfx/Interactions/webhook"
import * as Log from "dfx/Log"
import type { RateLimiter } from "dfx/RateLimit"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "dfx/RateLimit"

export {
  BadWebhookSignature,
  WebhookConfig,
  WebhookParseError,
  makeConfigLayer,
  makeHandler,
  makeSimpleHandler,
} from "dfx/Interactions/webhook"

export const MemoryRateLimit = Layer.provide(
  LiveMemoryRateLimitStore,
  LiveRateLimiter,
)

export const MemoryREST = Layer.provide(
  LiveMemoryRateLimitStore,
  LiveDiscordREST,
)

export const makeLiveWithoutFetch = (
  options: Config.Config.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
): Layer.Layer<
  HttpRequestExecutor,
  ConfigError.ConfigError,
  RateLimiter | DiscordREST | WebhookConfig
> =>
  Layer.unwrapEffect(
    Effect.map(Effect.config(Config.unwrap(options)), options => {
      const config = DiscordConfig.make(options)
      const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
      const LiveWebhook = makeConfigLayer(options)
      const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
      const LiveEnv = Layer.provide(
        Layer.merge(LiveLog, LiveConfig),
        Layer.mergeAll(MemoryREST, LiveWebhook, MemoryRateLimit),
      )

      return LiveEnv
    }),
  )

export const makeLive = (
  config: Config.Config.Wrap<DiscordConfig.MakeOpts & MakeConfigOpts>,
): Layer.Layer<
  never,
  ConfigError.ConfigError,
  RateLimiter | DiscordREST | WebhookConfig
> => Layer.provide(LiveFetchRequestExecutor, makeLiveWithoutFetch(config))

export const makeLiveWithoutConfig = (
  options: DiscordConfig.MakeOpts & MakeConfigOpts,
): Layer.Layer<never, never, RateLimiter | DiscordREST | WebhookConfig> => {
  const config = DiscordConfig.make(options)
  const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
  const LiveWebhook = makeConfigLayer(options)
  const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
  const LiveEnv = Layer.provide(
    Layer.merge(LiveLog, LiveConfig),
    Layer.mergeAll(MemoryREST, LiveWebhook, MemoryRateLimit),
  )
  return Layer.provide(LiveFetchRequestExecutor, LiveEnv)
}
