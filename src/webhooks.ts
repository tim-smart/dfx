import type { HttpClient } from "@effect/platform/HttpClient"
import type { DiscordConfig } from "dfx/DiscordConfig"
import type { DiscordREST } from "dfx/DiscordREST"
import { DiscordRESTLive } from "dfx/DiscordREST"
import type { RateLimiter } from "dfx/RateLimit"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "dfx/RateLimit"
import * as Layer from "effect/Layer"

export {
  BadWebhookSignature,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  layer as webhookLayer,
  layerConfig as webhookLayerConfig,
  WebhookParseError,
} from "dfx/Interactions/webhook"

export const DiscordLive: Layer.Layer<
  DiscordREST | RateLimiter,
  never,
  DiscordConfig | HttpClient.Service
> = Layer.mergeAll(DiscordRESTLive, RateLimiterLive).pipe(
  Layer.provide(MemoryRateLimitStoreLive),
)
