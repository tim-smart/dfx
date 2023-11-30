import { Tag } from "effect/Context"
import type * as HashSet from "effect/HashSet"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Stream from "effect/Stream"
import type { RunningShard } from "dfx/DiscordGateway/Shard"
import { LiveSharder, Sharder } from "dfx/DiscordGateway/Sharder"
import type * as Discord from "dfx/types"
import * as EffectUtils from "dfx/utils/Effect"
import * as Schedule from "effect/Schedule"

const fromDispatchFactory =
  <R, E>(
    source: Stream.Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream.Stream<R, E, Discord.ReceiveEvents[K]> =>
    Stream.map(
      Stream.filter(source, p => p.t === event),
      p => p.d! as any,
    )

const handleDispatchFactory =
  (hub: PubSub.PubSub<Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents, R, E, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect.Effect<R, E, A>,
  ): Effect.Effect<R, E, never> =>
    EffectUtils.subscribeForEachPar(hub, _ => {
      if (_.t === event) {
        return handle(_.d as any)
      }
      return Effect.unit as any
    })

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
  const hub = yield* _(
    PubSub.unbounded<Discord.GatewayPayload<Discord.ReceiveEvent>>(),
  )

  const sendQueue = yield* _(
    Queue.unbounded<Discord.GatewayPayload<Discord.SendEvent>>(),
  )
  const send = (payload: Discord.GatewayPayload<Discord.SendEvent>) =>
    sendQueue.offer(payload)

  const dispatch = Stream.fromPubSub(hub)
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(hub)

  yield* _(
    sharder.run(hub, sendQueue),
    Effect.tapErrorCause(_ => Effect.logError("fatal error, restarting", _)),
    Effect.retry(
      Schedule.exponential("1 seconds").pipe(
        Schedule.union(Schedule.spaced("30 seconds")),
      ),
    ),
    Effect.forkScoped,
  )

  return DiscordGateway.of({
    dispatch,
    fromDispatch,
    handleDispatch,
    send,
    shards: sharder.shards,
  })
}).pipe(
  Effect.annotateLogs({
    package: "dfx",
    service: "DiscordGateway",
  }),
)

export const LiveDiscordGateway = Layer.provide(
  Layer.scoped(DiscordGateway, make),
  LiveSharder,
)
