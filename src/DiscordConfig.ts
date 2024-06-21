import * as Discord from "dfx/types"
import * as Config from "effect/Config"
import type * as ConfigError from "effect/ConfigError"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type * as Redacted from "effect/Redacted"

const VERSION = 10

export interface DiscordConfig {
  readonly _: unique symbol
}

export interface DiscordConfigService {
  readonly token: Redacted.Redacted
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
export const DiscordConfig = GenericTag<DiscordConfig, DiscordConfigService>(
  "dfx/DiscordConfig",
)

export interface MakeOpts {
  readonly token: Redacted.Redacted
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

export const layer = (opts: MakeOpts): Layer.Layer<DiscordConfig> =>
  Layer.succeed(DiscordConfig, make(opts))

export const layerConfig = (
  _: Config.Config.Wrap<MakeOpts>,
): Layer.Layer<DiscordConfig, ConfigError.ConfigError> =>
  Layer.effect(DiscordConfig, Effect.map(Config.unwrap(_), make))
