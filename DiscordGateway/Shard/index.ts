import * as T from "@effect-ts/core/Effect"
import * as L from "@effect-ts/core/Effect/Layer"
import * as M from "@effect-ts/core/Effect/Managed"
import { flow, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import * as O from "@effect-ts/core/Option"
import * as CB from "callbag-effect-ts"
import * as Config from "../../DiscordConfig"
import * as DWS from "../DiscordWS"
import {
  GatewayEvent,
  GatewayOpcode,
  GatewayPayload,
  ReadyEvent,
} from "../../types"
import { Reconnect } from "../WS"
import * as Heartbeats from "./heartbeats"
import * as Identify from "./identify"
import * as Invalid from "./invalidSession"
import * as Utils from "./utils"

export interface Options {
  shard: [number, number]
}

const makeImpl = (shard: [id: number, count: number], url?: string) =>
  M.gen(function* (_) {
    const token = yield* _(Config.token)
    const gateway = yield* _(Config.gateway)
    const [emit, outbound] = CB.asyncEmitter<never, DWS.Message>()

    const sendMessages = CB.forEach((p: DWS.Message) =>
      T.succeedWith(() => {
        emit.data(p)
      }),
    )

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
        url,
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
      sendMessages,
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
      sendMessages,
    )

    // invalid session
    const invalidEffects = pipe(Invalid.fromRaw(raw, latestReady), sendMessages)

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
      send: (p: GatewayPayload) => emit.data(p),
      reconnect: () => emit.data(Reconnect),
    } as const
  })

const makeService = () =>
  ({
    _tag: "DiscordShardService",
    make: makeImpl,
  } as const)

export interface Shard extends ReturnType<typeof makeService> {}
export const Shard = tag<Shard>()
export const LiveShard = L.fromFunction(Shard)(makeService)

export const make = (shard: [number, number], url?: string) =>
  M.accessServiceM(Shard)(({ make }) => make(shard, url))
