import { spawn } from "./Sharder/index.js"

const fromDispatchFactory =
  <R, E>(
    source: EffectSource<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): EffectSource<R, E, Discord.ReceiveEvents[K]> =>
    source.filter((p) => p.t === event).map((p) => p.d! as any)

const handleDispatchFactory =
  <R, E>(
    source: EffectSource<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvents, R1, E1, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect<R1, E1, A>,
  ): Effect<R | R1, E | E1, void> =>
    source
      .filter((p) => p.t === event)
      .chainPar((a) => EffectSource.fromEffect(handle(a.d as any))).runDrain

export const make = Do(($) => {
  const shards = $(spawn.share)
  const raw = $(shards.chainPar((s) => s.raw).share)
  const dispatch = $(shards.chainPar((s) => s.dispatch).share)
  const fromDispatch = fromDispatchFactory(dispatch)
  const handleDispatch = handleDispatchFactory(dispatch)

  return {
    shards,
    raw,
    dispatch,
    fromDispatch,
    handleDispatch,
  }
})

export interface DiscordGateway extends Success<typeof make> {}
export const DiscordGateway = Tag<DiscordGateway>()
export const LiveDiscordGateway = Layer.fromEffect(DiscordGateway)(make)

export const handleDispatch = <
  K extends keyof Discord.ReceiveEvents,
  R1,
  E1,
  A,
>(
  event: K,
  handle: (event: Discord.ReceiveEvents[K]) => Effect<R1, E1, A>,
) =>
  Effect.serviceWithEffect(DiscordGateway)((a) =>
    a.handleDispatch(event, handle),
  )
