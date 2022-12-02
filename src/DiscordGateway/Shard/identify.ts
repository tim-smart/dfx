import * as SendEvents from "./sendEvents.js"
import * as OS from "os"
import { opCode } from "./utils.js"

export interface Options {
  token: string
  intents: number
  shard: [number, number]
  presence?: Discord.UpdatePresence
}

export interface Requirements {
  latestReady: Ref<Maybe<Discord.ReadyEvent>>
  latestSequence: Ref<Maybe<number>>
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
  ready: Ref<Maybe<Discord.ReadyEvent>>,
  seq: Ref<Maybe<number>>,
) =>
  Do(($) => {
    const readyEvent = $(ready.get)
    const seqNumber = $(seq.get)

    return Maybe.struct({
      readyEvent,
      seqNumber,
    }).match(
      () => identify(opts),
      ({ readyEvent, seqNumber }) => resume(opts.token, readyEvent, seqNumber),
    )
  })

export const fromRaw = <R, E>(
  source: EffectSource<R, E, Discord.GatewayPayload>,
  { latestReady, latestSequence, ...opts }: Options & Requirements,
) =>
  opCode(source)<Discord.HelloEvent>(Discord.GatewayOpcode.HELLO).mapEffect(
    () => identifyOrResume(opts, latestReady, latestSequence),
  )
