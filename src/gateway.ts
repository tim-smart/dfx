import * as CachePrelude from "dfx/Cache/prelude"
import type { DiscordGateway } from "dfx/DiscordGateway"
import { DiscordGatewayLive } from "dfx/DiscordGateway"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import { JsonDiscordWSCodecLive } from "dfx/DiscordGateway/DiscordWS"
import * as Shard from "dfx/DiscordGateway/Shard"
import { ShardStateStore } from "dfx/DiscordGateway/Shard/StateStore"
import * as SendEvent from "dfx/DiscordGateway/Shard/sendEvents"
import * as ShardStore from "dfx/DiscordGateway/ShardStore"
import { MemoryShardStoreLive } from "dfx/DiscordGateway/ShardStore"
import type { DiscordREST } from "dfx/DiscordREST"
import { DiscordRESTLive } from "dfx/DiscordREST"
import type { InteractionsRegistry } from "dfx/Interactions/gateway"
import { InteractionsRegistryLive } from "dfx/Interactions/gateway"
import type { RateLimiter } from "dfx/RateLimit"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "dfx/RateLimit"
import * as Layer from "effect/Layer"
import type * as HttpClient from "@effect/platform/HttpClient"
import type { DiscordConfig } from "dfx/DiscordConfig"
import type { WebSocketConstructor } from "@effect/platform/Socket"

export { DiscordGateway, DiscordGatewayLive } from "dfx/DiscordGateway"

export {
  InteractionsRegistry,
  InteractionsRegistryLive,
  interactionsSync,
  run as runIx,
  setInteractionsSync,
} from "dfx/Interactions/gateway"

export { CachePrelude, DiscordWS, SendEvent, Shard, ShardStore }

export const DiscordLive: Layer.Layer<
  RateLimiter | DiscordGateway | DiscordREST,
  never,
  DiscordConfig | WebSocketConstructor | HttpClient.HttpClient
> = Layer.mergeAll(RateLimiterLive, DiscordGatewayLive).pipe(
  Layer.provideMerge(DiscordRESTLive),
  Layer.provide(JsonDiscordWSCodecLive),
  Layer.provide(MemoryRateLimitStoreLive),
  Layer.provide(MemoryShardStoreLive),
  Layer.provide(ShardStateStore.MemoryLive),
)

export const DiscordIxLive: Layer.Layer<
  RateLimiter | DiscordGateway | DiscordREST | InteractionsRegistry,
  never,
  DiscordConfig | WebSocketConstructor | HttpClient.HttpClient
> = InteractionsRegistryLive.pipe(Layer.provideMerge(DiscordLive))
