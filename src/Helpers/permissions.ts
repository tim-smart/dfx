/**
 * A constant of all the permissions
 */
export const ALL = Flags.all(Discord.PermissionFlag)

/**
 * Check if a flag exists in the permissions.
 */
export const has = Flags.hasBigInt

/**
 * Convert a permissions bitfield to a list of flag names.
 */
export const toList = Flags.toList(Discord.PermissionFlag)

/**
 * Convert a list of flag names to a bitfield.
 */
export const fromList = Flags.fromListBigint(Discord.PermissionFlag)

/**
 * Reduce a list of roles to a bitfield of all the permissions added together.
 */
export const forRoles = (roles: Discord.Role[]) =>
  roles.reduce(
    (permissions, role) => permissions | BigInt(role.permissions),
    BigInt(0),
  )

/**
 * From a list of roles, calculate the permissions bitfield for the member.
 */
export const forMember =
  (roles: Discord.Role[]) => (member: Discord.GuildMember) =>
    pipe(Members.roles(roles)(member), forRoles)

const overwriteIsForMember =
  (guildId?: string) =>
  (member: Discord.GuildMember) =>
  (overwrite: Discord.Overwrite) => {
    if (overwrite.type === 0) {
      return overwrite.id === guildId || member.roles.includes(overwrite.id)
    }
    return overwrite.id === member.user?.id
  }

const overwriteIsForRole =
  (guildId?: string) =>
  (role: Discord.Role) =>
  (overwrite: Discord.Overwrite) => {
    if (overwrite.type === 0) {
      return overwrite.id === guildId || overwrite.id === role.id
    }

    return false
  }

/**
 * From a list of roles and a channel, calculate the permission bitfield for
 * the guild member or role for that channel.
 */
export const forChannel =
  (roles: Discord.Role[]) =>
  ({ guild_id, permission_overwrites: overwrites = [] }: Discord.Channel) =>
  (memberOrRole: Discord.GuildMember | Discord.Role) => {
    const hasAdmin = has(Discord.PermissionFlag.ADMINISTRATOR)
    let basePermissions: bigint
    let filteredOverwrites: Discord.Overwrite[]

    if (Members.is(memberOrRole)) {
      if (memberOrRole.permissions) return BigInt(memberOrRole.permissions)

      const memberRoles = Members.roles(roles)(memberOrRole)
      basePermissions = forRoles(memberRoles)
      filteredOverwrites = overwrites.filter(
        overwriteIsForMember(guild_id)(memberOrRole),
      )
    } else {
      const everyone = roles.find(role => role.name === "@everyone")

      basePermissions =
        BigInt(everyone?.permissions || "0") | BigInt(memberOrRole.permissions)
      filteredOverwrites = overwrites.filter(
        overwriteIsForRole(guild_id)(memberOrRole),
      )
    }

    if (hasAdmin(basePermissions)) {
      return ALL
    }

    return applyOverwrites(basePermissions)(filteredOverwrites)
  }

/**
 * Apply permission overwrites to a bitfield.
 */
export const applyOverwrites =
  (permissions: bigint) => (overwrites: Discord.Overwrite[]) =>
    overwrites.reduce(
      (permissions, overwrite) =>
        (permissions & ~BigInt(overwrite.deny)) | BigInt(overwrite.allow),
      permissions,
    )

interface RolesCache<E> {
  getForParent: (
    parentId: string,
  ) => Effect<never, E, ReadonlyMap<string, Discord.Role>>
}

export const hasInChannel =
  <E>(rolesCache: RolesCache<E>, permission: bigint) =>
  (
    channel: Discord.Channel,
    memberOrRole: Discord.GuildMember | Discord.Role,
  ) =>
    Do($ => {
      const roles = $(rolesCache.getForParent(channel.guild_id!))
      const channelPerms = forChannel([...roles.values()])(channel)(
        memberOrRole,
      )
      return has(permission)(channelPerms)
    })

export const hasInGuild =
  <E>(rolesCache: RolesCache<E>, permission: bigint) =>
  (guildId: Discord.Snowflake, member: Discord.GuildMember) =>
    Do($ => {
      const roles = $(rolesCache.getForParent(guildId))
      const hasPerm = has(permission)

      return member.roles.some(id => {
        const role = roles.get(id)
        return role ? hasPerm(role.permissions) : false
      })
    })
