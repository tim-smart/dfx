import { Messaging, MesssagingLive } from "dfx/DiscordGateway/Messaging"
import type { RunningShard } from "dfx/DiscordGateway/Shard"
import { Sharder, SharderLive } from "dfx/DiscordGateway/Sharder"
import type * as Discord from "dfx/types"
import { Tag } from "effect/Context"
import * as Effect from "effect/Effect"
import type * as HashSet from "effect/HashSet"
import * as Layer from "effect/Layer"
import type * as Stream from "effect/Stream"

export interface DiscordGateway {
  readonly dispatch: Stream.Stream<
    never,
    never,
    Discord.GatewayPayload<Discord.ReceiveEvent>
  >
  readonly fromDispatch: <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ) => Stream.Stream<never, never, Discord.ReceiveEvents[K]>
  readonly handleDispatch: <K extends keyof Discord.ReceiveEvents, R, E, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect.Effect<R, E, A>,
  ) => Effect.Effect<R, E, never>
  readonly send: (
    payload: Discord.GatewayPayload<Discord.SendEvent>,
  ) => Effect.Effect<never, never, boolean>
  readonly shards: Effect.Effect<never, never, HashSet.HashSet<RunningShard>>
}
export const DiscordGateway = Tag<DiscordGateway>()

export const make = Effect.gen(function* (_) {
  const sharder = yield* _(Sharder)
  const messaging = yield* _(Messaging)

  return DiscordGateway.of({
    dispatch: messaging.dispatch,
    fromDispatch: messaging.fromDispatch,
    handleDispatch: messaging.handleDispatch,
    send: messaging.send,
    shards: sharder.shards,
  })
})

export const DiscordGatewayLive = Layer.effect(DiscordGateway, make).pipe(
  Layer.provide(MesssagingLive),
  Layer.provide(SharderLive),
)
