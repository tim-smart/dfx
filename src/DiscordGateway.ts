import type { WebSocketConstructor } from "effect/unstable/socket/Socket"
import type { DiscordConfig } from "./DiscordConfig.ts"
import type { DiscordWSCodec } from "./DiscordGateway/DiscordWS.ts"
import type { Messsaging } from "./DiscordGateway/Messaging.ts"
import { Messaging, MesssagingLive } from "./DiscordGateway/Messaging.ts"
import type { RunningShard } from "./DiscordGateway/Shard.ts"
import type { ShardStateStore } from "./DiscordGateway/Shard/StateStore.ts"
import { Sharder, SharderLive } from "./DiscordGateway/Sharder.ts"
import type { ShardStore } from "./DiscordGateway/ShardStore.ts"
import type { RateLimitStore } from "./RateLimit.ts"
import type * as Discord from "./types.ts"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type * as Stream from "effect/Stream"
import type { HttpClient } from "effect/unstable/http/HttpClient"
import * as ServiceMap from "effect/ServiceMap"

export const TypeId = Symbol.for("dfx/DiscordGateway")
export type TypeId = typeof TypeId

export interface DiscordGateway {
  readonly [TypeId]: TypeId

  readonly dispatch: Stream.Stream<Discord.GatewayReceivePayload>
  readonly fromDispatch: <K extends `${Discord.GatewayDispatchEvents}`>(
    event: K,
  ) => Stream.Stream<
    Extract<Discord.DistributedGatewayDispatchPayload, { readonly t: K }>["d"]
  >
  readonly handleDispatch: <
    K extends `${Discord.GatewayDispatchEvents}`,
    R,
    E,
    A,
  >(
    event: K,
    handle: (
      event: Extract<
        Discord.DistributedGatewayDispatchPayload,
        { readonly t: K }
      >["d"],
    ) => Effect.Effect<A, E, R>,
  ) => Effect.Effect<never, E, R>
  readonly send: (payload: Discord.GatewaySendPayload) => Effect.Effect<boolean>
  readonly shards: Effect.Effect<ReadonlySet<RunningShard>>
}

export const DiscordGateway =
  ServiceMap.Service<DiscordGateway>("dfx/DiscordGateway")

export const make: Effect.Effect<DiscordGateway, never, Messsaging | Sharder> =
  Effect.gen(function* () {
    const sharder = yield* Sharder
    const messaging = yield* Messaging

    return DiscordGateway.of({
      [TypeId]: TypeId,
      dispatch: messaging.dispatch,
      fromDispatch: messaging.fromDispatch as any,
      handleDispatch: messaging.handleDispatch as any,
      send: messaging.send,
      shards: sharder.shards,
    })
  })

export const DiscordGatewayLive: Layer.Layer<
  DiscordGateway,
  never,
  | ShardStore
  | DiscordConfig
  | RateLimitStore
  | DiscordWSCodec
  | ShardStateStore
  | WebSocketConstructor
  | HttpClient
> = Layer.effect(DiscordGateway, make).pipe(
  Layer.provide(MesssagingLive),
  Layer.provide(SharderLive),
)
