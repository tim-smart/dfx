import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import * as SendEvents from "dfx/DiscordGateway/Shard/sendEvents"
import type * as Discord from "dfx/types"
import * as OS from "os"

export interface Options {
  readonly token: string
  readonly intents: number
  readonly shard: [number, number]
  readonly presence?: Discord.UpdatePresence
}

export interface Requirements {
  readonly latestReady: Ref.Ref<Option.Option<Discord.ReadyEvent>>
  readonly latestSequence: Ref.Ref<Option.Option<number>>
}

const identify = ({ intents, presence, shard, token }: Options) =>
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

export const identifyOrResume = (
  opts: Options,
  ready: Ref.Ref<Option.Option<Discord.ReadyEvent>>,
  seq: Ref.Ref<Option.Option<number>>,
): Effect.Effect<
  never,
  never,
  | Discord.GatewayPayload<Discord.Identify>
  | Discord.GatewayPayload<Discord.Resume>
> =>
  Effect.map(
    Effect.all([Ref.get(ready), Ref.get(seq)]),
    ([readyEvent, seqNumber]) =>
      Option.match(Option.all({ readyEvent, seqNumber }), {
        onNone: () => identify(opts),
        onSome: ({ readyEvent, seqNumber }) =>
          resume(opts.token, readyEvent, seqNumber),
      }),
  )
