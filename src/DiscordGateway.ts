import type { HttpClient } from "@effect/platform/HttpClient"
import type { WebSocketConstructor } from "@effect/platform/Socket"
import type { DiscordConfig } from "dfx/DiscordConfig"
import type { DiscordWSCodec } from "dfx/DiscordGateway/DiscordWS"
import type { Messsaging } from "dfx/DiscordGateway/Messaging"
import { Messaging, MesssagingLive } from "dfx/DiscordGateway/Messaging"
import type { RunningShard } from "dfx/DiscordGateway/Shard"
import type { ShardStateStore } from "dfx/DiscordGateway/Shard/StateStore"
import { Sharder, SharderLive } from "dfx/DiscordGateway/Sharder"
import type { ShardStore } from "dfx/DiscordGateway/ShardStore"
import type { RateLimitStore } from "dfx/RateLimit"
import type * as Discord from "dfx/types"
import { GenericTag } from "effect/Context"
import * as Effect from "effect/Effect"
import type * as HashSet from "effect/HashSet"
import * as Layer from "effect/Layer"
import type * as Stream from "effect/Stream"

export const TypeId = Symbol.for("dfx/DiscordGateway")
export type TypeId = typeof TypeId

export interface DiscordGateway {
  readonly [TypeId]: TypeId

  readonly dispatch: Stream.Stream<Discord.GatewayPayload<Discord.ReceiveEvent>>
  readonly fromDispatch: <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ) => Stream.Stream<Discord.ReceiveEvents[K]>
  readonly handleDispatch: <K extends keyof Discord.ReceiveEvents, R, E, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect.Effect<A, E, R>,
  ) => Effect.Effect<never, E, R>
  readonly send: (
    payload: Discord.GatewayPayload<Discord.SendEvent>,
  ) => Effect.Effect<boolean>
  readonly shards: Effect.Effect<HashSet.HashSet<RunningShard>>
}

export const DiscordGateway = GenericTag<DiscordGateway>("dfx/DiscordGateway")

export const make: Effect.Effect<DiscordGateway, never, Messsaging | Sharder> =
  Effect.gen(function* () {
    const sharder = yield* Sharder
    const messaging = yield* Messaging

    return DiscordGateway.of({
      [TypeId]: TypeId,
      dispatch: messaging.dispatch,
      fromDispatch: messaging.fromDispatch,
      handleDispatch: messaging.handleDispatch,
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
