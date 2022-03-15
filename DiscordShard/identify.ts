import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as H from "@effect-ts/core/Effect/Hub"
import * as R from "@effect-ts/core/Effect/Ref"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import * as OS from "os"
import {
  GatewayOpcode,
  GatewayPayload,
  HelloEvent,
  ReadyEvent,
  UpdatePresence,
} from "../types"
import * as Commands from "./commands"
import * as Utils from "./utils"

export interface Options {
  token: string
  intents: number
  shard: [number, number]
  presence?: UpdatePresence
}

export interface Requirements {
  latestReady: R.Ref<O.Option<ReadyEvent>>
  latestSequence: R.Ref<O.Option<number>>
}

const identify = ({ token, intents, shard, presence }: Options) =>
  Commands.identify({
    token,
    intents,
    properties: {
      $os: OS.platform(),
      $browser: "dfx",
      $device: "dfx",
    },
    shard,
    presence,
  })

const resume = (token: string, ready: ReadyEvent, seq: number) =>
  Commands.resume({
    token,
    session_id: ready.session_id,
    seq,
  })

const identifyOrResume = (
  opts: Options,
  ready: R.Ref<O.Option<ReadyEvent>>,
  seq: R.Ref<O.Option<number>>
) =>
  pipe(
    R.get(ready),
    T.zip(R.get(seq)),
    T.map(({ tuple }) =>
      pipe(
        O.zip_(...tuple),
        O.fold(
          () => identify(opts),
          ({ tuple }) => resume(opts.token, ...tuple)
        )
      )
    )
  )

export const fromHub = (
  hub: H.Hub<GatewayPayload>,
  { latestReady, latestSequence, ...opts }: Options & Requirements
) =>
  pipe(
    Utils.opCode(hub)<HelloEvent>(GatewayOpcode.HELLO),
    S.mapEffect(() => identifyOrResume(opts, latestReady, latestSequence))
  )
