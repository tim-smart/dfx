import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as H from "@effect-ts/core/Effect/Hub"
import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as Q from "@effect-ts/core/Effect/Queue"
import { flow, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import * as O from "@effect-ts/core/Option"
import * as DWS from "../DiscordWS"
import {
  GatewayEvent,
  GatewayOpcode,
  GatewayPayload,
  ReadyEvent,
} from "../types"
import { Reconnect } from "../WS"
import * as Heartbeats from "./heartbeats"
import * as Identify from "./identify"
import * as Invalid from "./invalidSession"
import * as Utils from "./utils"

export type Options = Identify.Options

const makeImpl = (opts: Options) =>
  M.gen(function* (_) {
    const outbound = yield* _(Q.makeUnbounded<DWS.Message>())

    const [latestReady, updateLatestReady] = yield* _(
      Utils.latest(
        flow(
          O.fromPredicate(
            (p): p is GatewayPayload<ReadyEvent> =>
              p.op === GatewayOpcode.DISPATCH && p.t === "READY"
          ),
          O.map((p) => p.d!)
        )
      )
    )
    const [latestSequence, updateLatestSequence] = yield* _(
      Utils.latest((p) => O.fromNullable(p.s))
    )

    const hub = yield* _(H.makeUnbounded<GatewayPayload>())
    const publishToHub = pipe(
      DWS.open({
        outgoingQueue: outbound,
      }),
      S.unwrap,
      updateLatestSequence,
      updateLatestReady,
      S.forEach((p) => H.publish_(hub, p))
    )

    const dispatch: H.Hub<GatewayPayload<GatewayEvent>> = pipe(
      hub,
      H.filterOutput((p) => p.op === GatewayOpcode.DISPATCH)
    )
    const fromDispatch = Utils.fromDispatch(dispatch)

    // heartbeats
    const heartbeatEffects = pipe(
      Heartbeats.fromHub(hub, latestSequence),
      S.forEach((p) => Q.offer_(outbound, p))
    )

    // identify
    const identifyEffects = pipe(
      Identify.fromHub(hub, {
        ...opts,
        latestSequence,
        latestReady,
      }),
      S.forEach((p) => Q.offer_(outbound, p))
    )

    // invalid session
    const invalidEffects = pipe(
      Invalid.fromHub(hub, latestReady),
      S.forEach((p) => Q.offer_(outbound, p))
    )

    return {
      run: pipe(
        publishToHub,
        T.zipPar(heartbeatEffects),
        T.zipPar(identifyEffects),
        T.zipPar(invalidEffects),
        T.ignore
      ),
      raw: hub,
      dispatch,
      fromDispatch,
      send: (p: GatewayPayload) => Q.offer_(outbound, p),
      reconnect: () => Q.offer_(outbound, Reconnect),
    } as const
  })

const makeService = () =>
  ({
    _tag: "DiscordShardService",
    make: makeImpl,
  } as const)

export interface DiscordShard extends ReturnType<typeof makeService> {}
export const DiscordShard = tag<DiscordShard>()
export const LiveDiscordShard = L.fromFunction(DiscordShard)(makeService)

export const make = (opts: Identify.Options) =>
  M.accessServiceM(DiscordShard)(({ make }) => make(opts))
