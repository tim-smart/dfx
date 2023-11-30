import * as Config from "effect/Config"
import type * as ConfigError from "effect/ConfigError"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type { DiscordREST } from "dfx"
import { DiscordConfig, LiveDiscordREST, Log } from "dfx"
import * as CachePrelude from "dfx/Cache/prelude"
import type { DiscordGateway } from "dfx/DiscordGateway"
import { LiveDiscordGateway } from "dfx/DiscordGateway"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import { LiveJsonDiscordWSCodec } from "dfx/DiscordGateway/DiscordWS"
import * as Shard from "dfx/DiscordGateway/Shard"
import * as SendEvent from "dfx/DiscordGateway/Shard/sendEvents"
import * as ShardStore from "dfx/DiscordGateway/ShardStore"
import { LiveMemoryShardStore } from "dfx/DiscordGateway/ShardStore"
import * as WS from "dfx/DiscordGateway/WS"
import type { RateLimiter } from "dfx/RateLimit"
import { LiveMemoryRateLimitStore, LiveRateLimiter } from "dfx/RateLimit"

export { DiscordGateway, LiveDiscordGateway } from "dfx/DiscordGateway"

export {
  InteractionsRegistry,
  InteractionsRegistryLive,
  run as runIx,
} from "dfx/Interactions/gateway"

export { CachePrelude, DiscordWS, SendEvent, Shard, ShardStore, WS }

export const MemoryRateLimit = Layer.provide(
  LiveRateLimiter,
  LiveMemoryRateLimitStore,
)

export const MemoryBot = Layer.mergeAll(
  MemoryRateLimit,
  LiveDiscordGateway,
).pipe(
  Layer.provideMerge(LiveDiscordREST),
  Layer.provide(LiveJsonDiscordWSCodec),
  Layer.provide(LiveMemoryRateLimitStore),
  Layer.provide(LiveMemoryShardStore),
)

export const gatewayLayer = (
  config: Config.Config.Wrap<DiscordConfig.MakeOpts>,
): Layer.Layer<
  never,
  ConfigError.ConfigError,
  | RateLimiter
  | Log.Log
  | DiscordREST
  | DiscordGateway
  | DiscordConfig.DiscordConfig
> =>
  Layer.unwrapEffect(
    Effect.config(Config.unwrap(config)).pipe(
      Effect.map(DiscordConfig.make),
      Effect.map(config => {
        const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
        const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
        return Layer.provideMerge(MemoryBot, Layer.merge(LiveLog, LiveConfig))
      }),
    ),
  )
