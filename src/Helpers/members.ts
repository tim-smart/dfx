/**
 * From a list of roles, filter out the ones the guild member has.
 */
export const roles = (roles: Discord.Role[]) => (member: Discord.GuildMember) =>
  roles.filter(
    (role) => member.roles.includes(role.id) || role.name === "@everyone",
  )

/**
 * Type-guard function for checking if the object is a guild member
 */
export const is = (thing: unknown): thing is Discord.GuildMember =>
  Object.prototype.hasOwnProperty.call(thing, "roles") &&
  Object.prototype.hasOwnProperty.call(thing, "joined_at")
