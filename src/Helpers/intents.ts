import * as Flags from "./flags.ts"
import * as Discord from "../types.ts"

/**
 * All the intents
 */
export const ALL = Flags.all(Discord.GatewayIntentBits)

/**
 * Privileged intents
 */
export const PRIVILEGED =
  Discord.GatewayIntentBits.GuildPresences |
  Discord.GatewayIntentBits.GuildMembers |
  Discord.GatewayIntentBits.MessageContent

/**
 * Un-privileged intents
 */
export const UNPRIVILEGED = ALL ^ PRIVILEGED

/**
 * Function that converts a intents bitfield value to a list of intent names.
 */
export const toList = Flags.toList(Discord.GatewayIntentBits)

/**
 * Function that converts a list of intent names to a bitfield value.
 */
export const fromList = Flags.fromList(Discord.GatewayIntentBits)

/**
 * Check if an intent flag exists in the permissions.
 */
export const has = Flags.has
