import { Tag } from "effect/Context"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Stream from "effect/Stream"
import type * as Discord from "dfx/types"
import * as EffectUtils from "dfx/utils/Effect"

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

export const make = Effect.gen(function* (_) {
  const hub = yield* _(
    Effect.acquireRelease(
      PubSub.unbounded<Discord.GatewayPayload<Discord.ReceiveEvent>>(),
      PubSub.shutdown,
    ),
  )

  const sendQueue = yield* _(
    Effect.acquireRelease(
      Queue.unbounded<Discord.GatewayPayload<Discord.SendEvent>>(),
      Queue.shutdown,
    ),
  )
  const send = (payload: Discord.GatewayPayload<Discord.SendEvent>) =>
    sendQueue.offer(payload)

  const dispatch = Stream.fromPubSub(hub)
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(hub)

  return {
    hub,
    sendQueue,
    dispatch,
    fromDispatch,
    handleDispatch,
    send,
  } as const
})

export interface Messsaging {
  readonly _: unique symbol
}
export const Messaging = Tag<Messsaging, Effect.Effect.Success<typeof make>>(
  "dfx/DiscordGateway/Messaging",
)
export const MesssagingLive = Layer.scoped(Messaging, make)
