import { Sharder } from "./Sharder/index.js"

const fromDispatchFactory =
  <R, E>(source: Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream<R, E, Discord.ReceiveEvents[K]> =>
    source.filter(p => p.t === event).map(p => p.d! as any)

const handleDispatchFactory =
  <R, E>(source: Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents, R1, E1, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect<R1, E1, A>,
  ): Effect<R | R1, E | E1, void> =>
    source
      .filter(p => p.t === event)
      .flatMapPar(
        a => Stream.fromEffect(handle(a.d as any)),
        Number.POSITIVE_INFINITY,
      ).runDrain

export const make = Do($ => {
  const sharder = $(Effect.service(Sharder))
  const raw = $(
    sharder.shards
      .flatMapPar(s => s.raw, Number.POSITIVE_INFINITY)
      .broadcastDynamic(8),
  )
  const dispatch = $(
    sharder.shards
      .flatMapPar(s => s.dispatch, Number.POSITIVE_INFINITY)
      .broadcastDynamic(8),
  )
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(dispatch)

  return {
    raw,
    dispatch,
    fromDispatch,
    handleDispatch,
  }
})

export interface DiscordGateway extends Effect.Success<typeof make> {}
export const DiscordGateway = Tag<DiscordGateway>()
export const LiveDiscordGateway = Layer.scoped(DiscordGateway, make)
