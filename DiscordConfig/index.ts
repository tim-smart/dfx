import { tag } from "@effect-ts/system/Has"
import * as T from "@effect-ts/core/Effect"
import { flow } from "@effect-ts/system/Function"
import { fromValue } from "@effect-ts/system/Layer"
import { GatewayIntents, UpdatePresence } from "../types"

const VERSION = 9

export interface DiscordConfig {
  _tag: "DiscordConfig"
  token: string
  rest: {
    baseUrl: string
  }
  gateway: {
    intents: number
    presence?: UpdatePresence
  }
}
export const DiscordConfig = tag<DiscordConfig>()

export interface MakeOpts {
  token: string
  rest?: Partial<DiscordConfig["rest"]>
  gateway?: Partial<DiscordConfig["gateway"]>
}

export const make = ({ token, rest, gateway }: MakeOpts): DiscordConfig => ({
  _tag: "DiscordConfig",
  token,
  rest: {
    baseUrl: `https://discord.com/api/v${VERSION}`,
    ...(rest ?? {}),
  },
  gateway: {
    intents: GatewayIntents.GUILDS,
    ...(gateway ?? {}),
  },
})

export const makeLayer = flow(make, fromValue(DiscordConfig))

export const token = T.accessService(DiscordConfig)(({ token }) => token)
export const rest = T.accessService(DiscordConfig)(({ rest }) => rest)
export const gateway = T.accessService(DiscordConfig)(({ gateway }) => gateway)
