import { Success } from "dfx/utils/effect"
import {
  Context,
  Discord,
  Effect,
  Layer,
  pipe,
  Scope,
  Stream,
} from "dfx/_common"
import { Sharder } from "./Sharder/index.js"

const _scope = Scope.ScopeTypeId

const fromDispatchFactory =
  <R, E>(
    source: Stream.Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvents>(
    event: K,
  ): Stream.Stream<R, E, Discord.ReceiveEvents[K]> =>
    source.filter((p) => p.t === event).map((p) => p.d! as any)

const handleDispatchFactory =
  <R, E>(
    source: Stream.Stream<R, E, Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
  <K extends keyof Discord.ReceiveEvents, R1, E1, A>(
    event: K,
    handle: (event: Discord.ReceiveEvents[K]) => Effect.Effect<R1, E1, A>,
  ): Effect.Effect<R | R1, E | E1, void> =>
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
export const DiscordGateway = Context.Tag<DiscordGateway>()
export const LiveDiscordGateway = Layer.scoped(DiscordGateway)(make)
