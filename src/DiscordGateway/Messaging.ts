import { GenericTag } from "effect/Context"
import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Stream from "effect/Stream"
import type * as Discord from "dfx/types"
import * as EffectUtils from "dfx/utils/Effect"

const fromDispatchFactory =
  <R, E>(
    source: Stream.Stream<Discord.GatewayPayload<Discord.ReceiveEvent>, E, R>,
  ) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream.Stream<Discord.ReceiveEvents[K], E, R> =>
    Stream.map(
      Stream.filter(source, p => p.t === event),
      p => p.d! as any,
    )

const handleDispatchFactory =
  (hub: PubSub.PubSub<Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents, R, E, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect.Effect<A, E, R>,
  ): Effect.Effect<never, E, R> =>
    EffectUtils.subscribeForEachPar(hub, _ => {
      if (_.t === event) {
        return handle(_.d as any)
      }
      return Effect.void as any
    })

export const make = Effect.gen(function* () {
  const hub = yield* Effect.acquireRelease(
    PubSub.unbounded<Discord.GatewayPayload<Discord.ReceiveEvent>>(),
    PubSub.shutdown,
  )

  const sendQueue = yield* Effect.acquireRelease(
    Queue.unbounded<Discord.GatewayPayload<Discord.SendEvent>>(),
    Queue.shutdown,
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
export const Messaging = GenericTag<
  Messsaging,
  Effect.Effect.Success<typeof make>
>("dfx/DiscordGateway/Messaging")
export const MesssagingLive = Layer.scoped(Messaging, make)
