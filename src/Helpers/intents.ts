/**
 * All the intents
 */
export const ALL = Flags.all(Discord.GatewayIntents)

/**
 * Privileged intents
 */
export const PRIVILEGED =
  Discord.GatewayIntents.GUILD_PRESENCES |
  Discord.GatewayIntents.GUILD_MEMBERS |
  Discord.GatewayIntents.MESSAGE_CONTENT

/**
 * Un-privileged intents
 */
export const UNPRIVILEGED = ALL ^ PRIVILEGED

/**
 * Function that converts a intents bitfield value to a list of intent names.
 */
export const toList = Flags.toList(Discord.GatewayIntents)

/**
 * Function that converts a list of intent names to a bitfield value.
 */
export const fromList = Flags.fromList(Discord.GatewayIntents)

/**
 * Check if an intent flag exists in the permissions.
 */
export const has = Flags.has
