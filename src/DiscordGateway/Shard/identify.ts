import * as SendEvents from "./sendEvents.js"
import * as OS from "os"
import { opCode } from "./utils.js"
import { Discord } from "dfx"
import { Option, Ref, Stream } from "dfx/_common"

export interface Options {
  token: string
  intents: number
  shard: [number, number]
  presence?: Discord.UpdatePresence
}

export interface Requirements {
  latestReady: Ref.Ref<Option.Option<Discord.ReadyEvent>>
  latestSequence: Ref.Ref<Option.Option<number>>
}

const identify = ({ token, intents, shard, presence }: Options) =>
  SendEvents.identify({
    token,
    intents,
    properties: {
      os: OS.platform(),
      browser: "dfx",
      device: "dfx",
    },
    shard,
    presence,
  })

const resume = (token: string, ready: Discord.ReadyEvent, seq: number) =>
  SendEvents.resume({
    token,
    session_id: ready.session_id,
    seq,
  })

const identifyOrResume = (
  opts: Options,
  ready: Ref.Ref<Option.Option<Discord.ReadyEvent>>,
  seq: Ref.Ref<Option.Option<number>>,
) =>
  Do(($) => {
    const readyEvent = $(ready.get)
    const seqNumber = $(seq.get)

    return Option.struct({
      readyEvent,
      seqNumber,
    }).match(
      () => identify(opts),
      ({ readyEvent, seqNumber }) => resume(opts.token, readyEvent, seqNumber),
    )
  })

export const fromRaw = <R, E>(
  source: Stream.Stream<R, E, Discord.GatewayPayload>,
  { latestReady, latestSequence, ...opts }: Options & Requirements,
) =>
  opCode(source)<Discord.HelloEvent>(Discord.GatewayOpcode.HELLO).mapEffect(
    () => identifyOrResume(opts, latestReady, latestSequence),
  )
