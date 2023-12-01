import { LiveDiscordREST as DiscordRESTLive } from "dfx"
import * as CachePrelude from "dfx/Cache/prelude"
import { DiscordGatewayLive } from "dfx/DiscordGateway"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import { LiveJsonDiscordWSCodec as JsonDiscordWSCodecLive } from "dfx/DiscordGateway/DiscordWS"
import * as Shard from "dfx/DiscordGateway/Shard"
import * as SendEvent from "dfx/DiscordGateway/Shard/sendEvents"
import * as ShardStore from "dfx/DiscordGateway/ShardStore"
import { MemoryShardStoreLive } from "dfx/DiscordGateway/ShardStore"
import * as WS from "dfx/DiscordGateway/WS"
import { InteractionsRegistryLive } from "dfx/Interactions/gateway"
import { LogLive } from "dfx/Log"
import { MemoryRateLimitStoreLive, RateLimiterLive } from "dfx/RateLimit"
import * as Layer from "effect/Layer"

export { DiscordGateway, DiscordGatewayLive } from "dfx/DiscordGateway"

export {
  InteractionsRegistry,
  InteractionsRegistryLive,
  interactionsSync,
  run as runIx,
  setInteractionsSync,
} from "dfx/Interactions/gateway"

export { CachePrelude, DiscordWS, SendEvent, Shard, ShardStore, WS }

export const DiscordLive = Layer.mergeAll(
  RateLimiterLive,
  DiscordGatewayLive,
).pipe(
  Layer.provideMerge(DiscordRESTLive),
  Layer.provide(JsonDiscordWSCodecLive),
  Layer.provide(MemoryRateLimitStoreLive),
  Layer.provide(MemoryShardStoreLive),
  Layer.provideMerge(LogLive),
)

export const DiscordIxLive = InteractionsRegistryLive.pipe(
  Layer.provideMerge(DiscordLive),
)
