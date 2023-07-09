import {
  HttpRequestExecutor,
  LiveFetchRequestExecutor,
} from "@effect-http/client"
import * as Config from "@effect/io/Config"
import * as ConfigError from "@effect/io/Config/Error"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import { DiscordConfig, DiscordREST, LiveDiscordREST, Log } from "dfx"
import { DiscordGateway, LiveDiscordGateway } from "dfx/DiscordGateway"
import { LiveJsonDiscordWSCodec } from "dfx/DiscordGateway/DiscordWS"
import { LiveMemoryShardStore } from "dfx/DiscordGateway/ShardStore"
import {
  LiveMemoryRateLimitStore,
  LiveRateLimiter,
  RateLimiter,
} from "dfx/RateLimit"

export * as CachePrelude from "dfx/Cache/prelude"
export { DiscordGateway, LiveDiscordGateway } from "dfx/DiscordGateway"
export * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
export * as Shard from "dfx/DiscordGateway/Shard"
export * as SendEvent from "dfx/DiscordGateway/Shard/sendEvents"
export * as ShardStore from "dfx/DiscordGateway/ShardStore"
export * as WS from "dfx/DiscordGateway/WS"
export {
  InteractionsRegistry,
  InteractionsRegistryLive,
  run as runIx,
} from "dfx/Interactions/gateway"

export const MemoryRateLimit = Layer.provide(
  LiveMemoryRateLimitStore,
  LiveRateLimiter,
)

export const MemoryBot = Layer.provide(
  Layer.mergeAll(
    LiveMemoryShardStore,
    LiveMemoryRateLimitStore,
    LiveJsonDiscordWSCodec,
  ),
  Layer.merge(
    Layer.provideMerge(LiveDiscordREST, LiveDiscordGateway),
    MemoryRateLimit,
  ),
)
export const makeLiveWithoutFetch = (
  config: Config.Config.Wrap<DiscordConfig.MakeOpts>,
): Layer.Layer<
  HttpRequestExecutor,
  ConfigError.ConfigError,
  | RateLimiter
  | Log.Log
  | DiscordREST
  | DiscordConfig.DiscordConfig
  | DiscordGateway
> =>
  Layer.unwrapEffect(
    Effect.config(Config.unwrap(config)).pipe(
      Effect.map(DiscordConfig.make),
      Effect.map(config => {
        const LiveLog = config.debug ? Log.LiveLogDebug : Log.LiveLog
        const LiveConfig = Layer.succeed(DiscordConfig.DiscordConfig, config)
        return Layer.provideMerge(Layer.merge(LiveLog, LiveConfig), MemoryBot)
      }),
    ),
  )

export const makeLive = (
  config: Config.Config.Wrap<DiscordConfig.MakeOpts>,
): Layer.Layer<
  never,
  ConfigError.ConfigError,
  | RateLimiter
  | Log.Log
  | DiscordREST
  | DiscordConfig.DiscordConfig
  | DiscordGateway
> => Layer.provide(LiveFetchRequestExecutor, makeLiveWithoutFetch(config))
