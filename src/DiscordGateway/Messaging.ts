import * as Effect from "effect/Effect"
import * as PubSub from "effect/PubSub"
import * as Layer from "effect/Layer"
import * as Stream from "effect/Stream"
import type * as Discord from "../types.ts"
import * as EffectUtils from "../utils/Effect.ts"
import * as Queue from "effect/Queue"
import * as ServiceMap from "effect/ServiceMap"

const fromDispatchFactory =
  <R, E>(source: Stream.Stream<Discord.GatewayReceivePayload, E, R>) =>
  <K extends `${Discord.GatewayDispatchEvents}`>(
    event: K,
  ): Stream.Stream<
    Extract<Discord.DistributedGatewayDispatchPayload, { readonly t: K }>["d"],
    E,
    R
  > =>
    Stream.map(
      Stream.filter(source, p => p.t === event),
      p => p.d,
    ) as any

const handleDispatchFactory =
  (hub: PubSub.PubSub<Discord.GatewayReceivePayload>) =>
  <K extends `${Discord.GatewayDispatchEvents}`, R, E, A>(
    event: K,
    handle: (
      event: Extract<Discord.GatewayDispatchPayload, { readonly t: K }>["d"],
    ) => Effect.Effect<A, E, R>,
  ): Effect.Effect<never, E, R> =>
    EffectUtils.subscribeForEachPar(hub, _ => {
      if (_.t === event) {
        return handle(_.d as any)
      }
      return Effect.void as any
    })

export const make = Effect.gen(function* () {
  const hub = yield* Effect.acquireRelease(
    PubSub.unbounded<Discord.GatewayReceivePayload>(),
    PubSub.shutdown,
  )

  const sendMailbox = yield* Effect.acquireRelease(
    Queue.make<Discord.GatewaySendPayload>(),
    Queue.shutdown,
  )
  const send = (payload: Discord.GatewaySendPayload) =>
    Queue.offer(sendMailbox, payload)

  const dispatch = Stream.fromPubSub(hub)
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(hub)

  return {
    hub,
    sendMailbox,
    dispatch,
    fromDispatch,
    handleDispatch,
    send,
  } as const
})

export class Messaging extends ServiceMap.Service<Messaging>()(
  "dfx/DiscordGateway/Messaging",
  { make },
) {}
export type Messsaging = Messaging
export const MesssagingLive = Layer.effect(Messaging, make)
