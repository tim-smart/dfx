import type { HttpClient } from "effect/unstable/http/HttpClient"
import type { DiscordConfig } from "./DiscordConfig.ts"
import type { DiscordREST } from "./DiscordREST.ts"
import { DiscordRESTLive } from "./DiscordREST.ts"
import type { RateLimiter } from "./RateLimit.ts"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "./RateLimit.ts"
import * as Layer from "effect/Layer"

export {
  BadWebhookSignature,
  makeHandler,
  makeSimpleHandler,
  WebhookConfig,
  layer as webhookLayer,
  layerConfig as webhookLayerConfig,
  WebhookParseError,
} from "./Interactions/webhook.ts"

export const DiscordLive: Layer.Layer<
  DiscordREST | RateLimiter,
  never,
  DiscordConfig | HttpClient
> = Layer.mergeAll(DiscordRESTLive, RateLimiterLive).pipe(
  Layer.provide(MemoryRateLimitStoreLive),
)
