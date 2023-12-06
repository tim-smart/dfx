import { Tag } from "effect/Context"
import * as Duration from "effect/Duration"
import * as Config from "effect/Config"
import type * as ConfigError from "effect/ConfigError"
import type * as Secret from "effect/Secret"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Discord from "dfx/types"

const VERSION = 10

export interface DiscordConfig {
  readonly _: unique symbol
}

export interface DiscordConfigService {
  readonly token: Secret.Secret
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
export const DiscordConfig = Tag<DiscordConfig, DiscordConfigService>(
  "dfx/DiscordConfig",
)

export interface MakeOpts {
  readonly token: Secret.Secret
  readonly rest?: Partial<DiscordConfigService["rest"]>
  readonly gateway?: Partial<DiscordConfigService["gateway"]>
}

export const make = ({
  gateway,
  rest,
  token,
}: MakeOpts): DiscordConfigService => ({
  token,
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

export const layer = (
  opts: MakeOpts,
): Layer.Layer<never, never, DiscordConfig> =>
  Layer.succeed(DiscordConfig, make(opts))

export const layerConfig = (
  _: Config.Config.Wrap<MakeOpts>,
): Layer.Layer<never, ConfigError.ConfigError, DiscordConfig> =>
  Layer.effect(DiscordConfig, Effect.map(Effect.config(Config.unwrap(_)), make))
