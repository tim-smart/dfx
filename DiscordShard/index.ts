import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import * as Q from "@effect-ts/core/Effect/Queue"
import { flow, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import * as O from "@effect-ts/core/Option"
import * as CB from "callbag-effect-ts"
import * as Config from "../DiscordConfig"
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

export interface Options {
  shard: [number, number]
}

const makeImpl = (shard: [id: number, count: number]) =>
  M.gen(function* (_) {
    const token = yield* _(Config.token)
    const gateway = yield* _(Config.gateway)
    const outbound = yield* _(Q.makeUnbounded<DWS.Message>())

    const [latestReady, updateLatestReady] = yield* _(
      Utils.latest(
        flow(
          O.fromPredicate(
            (p): p is GatewayPayload<ReadyEvent> =>
              p.op === GatewayOpcode.DISPATCH && p.t === "READY",
          ),
          O.map((p) => p.d!),
        ),
      ),
    )
    const [latestSequence, updateLatestSequence] = yield* _(
      Utils.latest((p) => O.fromNullable(p.s)),
    )

    const raw = pipe(
      DWS.open({
        outgoingQueue: outbound,
      }),
      CB.unwrap,
      CB.share,
    )
    const updateRefs = pipe(
      raw,
      updateLatestSequence,
      updateLatestReady,
      CB.runDrain,
    )

    const dispatch = pipe(
      raw,
      CB.filter(
        (p): p is GatewayPayload<GatewayEvent> =>
          p.op === GatewayOpcode.DISPATCH,
      ),
      CB.share,
    )

    // heartbeats
    const heartbeatEffects = pipe(
      Heartbeats.fromRaw(raw, latestSequence),
      CB.forEach((p) => Q.offer_(outbound, p)),
    )

    // identify
    const identifyEffects = pipe(
      Identify.fromRaw(raw, {
        token,
        shard,
        intents: gateway.intents,
        presence: gateway.presence,
        latestSequence,
        latestReady,
      }),
      CB.forEach((p) => Q.offer_(outbound, p)),
    )

    // invalid session
    const invalidEffects = pipe(
      Invalid.fromRaw(raw, latestReady),
      CB.forEach((p) => Q.offer_(outbound, p)),
    )

    return {
      run: pipe(
        updateRefs,
        T.zipPar(heartbeatEffects),
        T.zipPar(identifyEffects),
        T.zipPar(invalidEffects),
        T.ignore,
      ),
      raw,
      dispatch,
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

export const make = (shard: [number, number]) =>
  M.accessServiceM(DiscordShard)(({ make }) => make(shard))
