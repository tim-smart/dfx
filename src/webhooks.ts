import { DiscordRESTLive } from "dfx/DiscordREST"
import * as Log from "dfx/Log"
import {
  MemoryRateLimitStoreLive as MemoryRateLimitStoreLive,
  RateLimiterLive as RateLimiterLive,
} from "dfx/RateLimit"
import * as Layer from "effect/Layer"

export {
  BadWebhookSignature,
  WebhookConfig,
  WebhookParseError,
  makeHandler,
  makeSimpleHandler,
  layer as webhookLayer,
  layerConfig as webhookLayerConfig,
} from "dfx/Interactions/webhook"

export const DiscordLive = Layer.mergeAll(
  DiscordRESTLive,
  RateLimiterLive,
).pipe(Layer.provide(MemoryRateLimitStoreLive), Layer.provideMerge(Log.LogLive))
