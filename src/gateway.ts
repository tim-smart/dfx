import * as CachePrelude from "./Cache/prelude.ts"
import type { DiscordGateway } from "./DiscordGateway.ts"
import { DiscordGatewayLive } from "./DiscordGateway.ts"
import * as DiscordWS from "./DiscordGateway/DiscordWS.ts"
import { JsonDiscordWSCodecLive } from "./DiscordGateway/DiscordWS.ts"
import * as Shard from "./DiscordGateway/Shard.ts"
import { ShardStateStore } from "./DiscordGateway/Shard/StateStore.ts"
import * as SendEvent from "./DiscordGateway/Shard/sendEvents.ts"
import * as ShardStore from "./DiscordGateway/ShardStore.ts"
import { MemoryShardStoreLive } from "./DiscordGateway/ShardStore.ts"
import type { DiscordREST } from "./DiscordREST.ts"
import { DiscordRESTLive } from "./DiscordREST.ts"
import type { InteractionsRegistry } from "./Interactions/gateway.ts"
import { InteractionsRegistryLive } from "./Interactions/gateway.ts"
import type { RateLimiter } from "./RateLimit.ts"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "./RateLimit.ts"
import * as Layer from "effect/Layer"
import type * as HttpClient from "effect/unstable/http/HttpClient"
import type { DiscordConfig } from "./DiscordConfig.ts"
import type { WebSocketConstructor } from "effect/unstable/socket/Socket"

export { DiscordGateway, DiscordGatewayLive } from "./DiscordGateway.ts"

export {
  InteractionsRegistry,
  InteractionsRegistryLive,
  interactionsSync,
  run as runIx,
  setInteractionsSync,
} from "./Interactions/gateway.ts"

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
