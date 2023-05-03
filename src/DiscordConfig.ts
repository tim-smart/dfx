const VERSION = 10

export interface DiscordConfig {
  token: ConfigSecret
  debug: boolean
  rest: {
    baseUrl: string
    globalRateLimit: {
      limit: number
      window: Duration
    }
  }
  gateway: {
    intents: number
    presence?: Discord.UpdatePresence
    shardCount?: number

    identifyRateLimit: readonly [window: number, limit: number]
  }
}
export const DiscordConfig = Tag<DiscordConfig>()

export interface MakeOpts {
  token: ConfigSecret
  debug?: boolean
  rest?: Partial<DiscordConfig["rest"]>
  gateway?: Partial<DiscordConfig["gateway"]>
}

export const make = ({
  token,
  debug = false,
  rest,
  gateway,
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

export const makeLayer = flow(make, _ => Layer.succeed(DiscordConfig, _))
export const makeFromConfig = (_: Config.Wrap<MakeOpts>) =>
  Config.unwrap(_).config.map(make).toLayer(DiscordConfig)
