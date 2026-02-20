import type * as Discord from "../types.ts"

/**
 * From a list of roles, filter out the ones the guild member has.
 */
export const roles =
  (guildRoles: Array<Discord.GuildRoleResponse>) =>
  (member: Discord.GuildMemberResponse) =>
    guildRoles.filter(
      role => member.roles.includes(role.id) || role.name === "@everyone",
    )

/**
 * Type-guard function for checking if the object is a guild member
 */
export const is = (thing: unknown): thing is Discord.GuildMemberResponse =>
  Object.prototype.hasOwnProperty.call(thing, "roles") &&
  Object.prototype.hasOwnProperty.call(thing, "joined_at")
