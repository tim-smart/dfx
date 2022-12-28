import { Sharder } from "./Sharder/index.js"

const fromDispatchFactory =
  <R, E>(source: Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream<R, E, Discord.ReceiveEvents[K]> =>
    source.filter((p) => p.t === event).map((p) => p.d! as any)

const handleDispatchFactory =
  <R, E>(source: Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>) =>
  <K extends keyof Discord.ReceiveEvents, R1, E1, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect<R1, E1, A>,
  ): Effect<R | R1, E | E1, void> =>
    pipe(
      source.filter((p) => p.t === event),
      Stream.flatMapPar(128)((a) => Stream.fromEffect(handle(a.d as any))),
    ).runDrain

export const make = Do(($) => {
  const sharder = $(Effect.service(Sharder))
  const raw = $(
    pipe(
      sharder.shards,
      Stream.flatMapPar(1024)((s) => s.raw),
    ).broadcastDynamic(1),
  )
  const dispatch = $(
    pipe(
      sharder.shards,
      Stream.flatMapPar(1024)((s) => s.dispatch),
    ).broadcastDynamic(1),
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

export interface DiscordGateway extends Success<typeof make> {}
export const DiscordGateway = Tag<DiscordGateway>()
export const LiveDiscordGateway = make.scoped(DiscordGateway)
