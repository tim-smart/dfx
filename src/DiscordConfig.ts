import { Tag } from "@effect/data/Context"
import * as Duration from "@effect/data/Duration"
import * as Config from "@effect/io/Config"
import type * as ConfigError from "@effect/io/Config/Error"
import type * as ConfigSecret from "@effect/io/Config/Secret"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import * as Discord from "dfx/types"

const VERSION = 10

export interface DiscordConfig {
  readonly token: ConfigSecret.ConfigSecret
  readonly debug: boolean
  readonly rest: {
    readonly baseUrl: string
    readonly globalRateLimit: {
      readonly limit: number
      readonly window: Duration.DurationInput
    }
  }
  readonly gateway: {
    readonly intents: number
    readonly presence?: Discord.UpdatePresence
    readonly shardCount?: number

    readonly identifyRateLimit: readonly [window: number, limit: number]
  }
}
export const DiscordConfig = Tag<DiscordConfig>()

export interface MakeOpts {
  readonly token: ConfigSecret.ConfigSecret
  readonly debug?: boolean
  readonly rest?: Partial<DiscordConfig["rest"]>
  readonly gateway?: Partial<DiscordConfig["gateway"]>
}

export const make = ({
  debug = false,
  gateway,
  rest,
  token,
}: MakeOpts): DiscordConfig => ({
  token,
  debug,
  rest: {
    baseUrl: `https://discord.com/api/v${VERSION}`,
    ...(rest ?? {}),
    globalRateLimit: {
      limit: 50,
      window: Duration.seconds(1),
      ...(rest?.globalRateLimit ?? {}),
    },
  },
  gateway: {
    intents: Discord.GatewayIntents.GUILDS,
    identifyRateLimit: [5000, 1],
    ...(gateway ?? {}),
  },
})

export const makeLayer = (
  opts: MakeOpts,
): Layer.Layer<never, never, DiscordConfig> =>
  Layer.succeed(DiscordConfig, make(opts))

export const makeFromConfig = (
  _: Config.Config.Wrap<MakeOpts>,
): Layer.Layer<never, ConfigError.ConfigError, DiscordConfig> =>
  Layer.effect(DiscordConfig, Effect.map(Effect.config(Config.unwrap(_)), make))
