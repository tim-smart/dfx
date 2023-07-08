import { LiveSharder, Sharder } from "./DiscordGateway/Sharder.js"

const fromDispatchFactory =
  <R, E>(source: Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream<R, E, Discord.ReceiveEvents[K]> =>
    source.filter(p => p.t === event).map(p => p.d! as any)

const handleDispatchFactory =
  (hub: Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents, R, E, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect<R, E, A>,
  ): Effect<R, E, never> =>
    hub.subscribeForEachPar(_ => {
      if (_.t === event) {
        return handle(_.d as any)
      }
      return Effect.unit
    })

export const make = Do($ => {
  const sharder = $(Sharder.accessWith(identity))
  const hub = $(Hub.unbounded<Discord.GatewayPayload<Discord.ReceiveEvent>>())

  const sendQueue = $(
    Queue.unbounded<Discord.GatewayPayload<Discord.SendEvent>>(),
  )
  const send = (payload: Discord.GatewayPayload<Discord.SendEvent>) =>
    sendQueue.offer(payload)

  const dispatch = Stream.fromHub(hub)
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(hub)

  const run = sharder.run(hub, sendQueue)

  return {
    run,
    dispatch,
    fromDispatch,
    handleDispatch,
    send,
    shards: sharder.shards,
  } as const
})

export interface DiscordGateway extends Effect.Success<typeof make> {}
export const DiscordGateway = Tag<DiscordGateway>()
export const LiveDiscordGateway =
  LiveSharder >> Layer.effect(DiscordGateway, make)
