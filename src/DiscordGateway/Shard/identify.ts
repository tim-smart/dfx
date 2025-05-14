import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as SendEvents from "dfx/DiscordGateway/Shard/sendEvents"
import type * as Discord from "dfx/types"
import * as OS from "os"
import type { ShardState } from "dfx/DiscordGateway/Shard/StateStore"

export interface Options {
  readonly token: string
  readonly intents: number
  readonly shard: [number, number]
  readonly presence?: Discord.GatewayPresenceUpdateData
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

const resume = (token: string, session_id: string, seq: number | null) =>
  SendEvents.resume({
    token,
    session_id,
    seq: seq!,
  })

export const identifyOrResume = (
  opts: Options,
  state: Effect.Effect<Option.Option<ShardState>>,
): Effect.Effect<Discord.GatewayIdentify | Discord.GatewayResume> =>
  Effect.map(
    state,
    Option.match({
      onNone: () => identify(opts),
      onSome: state => resume(opts.token, state.sessionId, state.sequence),
    }),
  )
