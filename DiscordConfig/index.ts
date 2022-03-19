import { tag } from "@effect-ts/system/Has"
import * as T from "@effect-ts/core/Effect"

const VERSION = 9

export interface DiscordConfig {
  _tag: "DiscordConfig"
  token: string
  rest: {
    baseUrl: string
  }
}
export const DiscordConfig = tag<DiscordConfig>()

export interface MakeOpts {
  token: string
  rest?: {
    baseUrl?: string
  }
}

export const make = ({ token, rest }: MakeOpts): DiscordConfig => ({
  _tag: "DiscordConfig",
  token,
  rest: {
    baseUrl: `https://discord.com/api/v${VERSION}`,
    ...(rest ?? {}),
  },
})

export const token = T.accessService(DiscordConfig)(({ token }) => token)
export const rest = T.accessService(DiscordConfig)(({ rest }) => rest)
