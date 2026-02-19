import { pipe } from "effect/Function"
import * as Effect from "effect/Effect"
import * as Flags from "./flags.ts"
import * as Members from "./members.ts"
import * as Discord from "../types.ts"

/**
 * A constant of all the permissions
 */
export const ALL = Flags.all(Discord.Permissions)

/**
 * Check if a flag exists in the permissions.
 */
export const has = Flags.hasBigInt

/**
 * Convert a permissions bitfield to a list of flag names.
 */
export const toList = Flags.toList(Discord.Permissions)

/**
 * Convert a list of flag names to a bitfield.
 */
export const fromList = Flags.fromListBigint(Discord.Permissions)

/**
 * Reduce a list of roles to a bitfield of all the permissions added together.
 */
export const forRoles = (roles: Array<Discord.GuildRoleResponse>) =>
  roles.reduce(
    (permissions, role) => permissions | BigInt(role.permissions),
    BigInt(0),
  )

/**
 * From a list of roles, calculate the permissions bitfield for the member.
 */
export const forMember =
  (roles: Array<Discord.GuildRoleResponse>) =>
  (member: Discord.GuildMemberResponse) =>
    pipe(Members.roles(roles)(member), forRoles)

const overwriteIsForMember =
  (guildId?: string) =>
  (member: Discord.GuildMemberResponse) =>
  (overwrite: Discord.ChannelPermissionOverwriteResponse) => {
    if (overwrite.type === 0) {
      return overwrite.id === guildId || member.roles.includes(overwrite.id)
    }
    return overwrite.id === member.user?.id
  }

const overwriteIsForRole =
  (guildId?: string) =>
  (role: Discord.GuildRoleResponse) =>
  (overwrite: Discord.ChannelPermissionOverwriteResponse) => {
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
  (roles: Array<Discord.GuildRoleResponse>) =>
  ({ guild_id, permission_overwrites }: Discord.GuildChannelResponse) =>
  (memberOrRole: Discord.GuildMemberResponse | Discord.GuildRoleResponse) => {
    const overwrites = permission_overwrites || []
    const hasAdmin = has(Discord.Permissions.Administrator)
    let basePermissions: bigint
    let filteredOverwrites: Array<Discord.ChannelPermissionOverwriteResponse>

    if (Members.is(memberOrRole)) {
      if ((memberOrRole as any).permissions)
        return BigInt((memberOrRole as any).permissions)

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
  (permissions: bigint) =>
  (overwrites: ReadonlyArray<Discord.ChannelPermissionOverwriteResponse>) =>
    overwrites.reduce(
      (permissions, overwrite) =>
        (permissions & ~BigInt(overwrite.deny)) | BigInt(overwrite.allow),
      permissions,
    )

interface RolesCache<E> {
  getForParent: (
    parentId: string,
  ) => Effect.Effect<ReadonlyMap<string, Discord.GuildRoleResponse>, E>
}

export const hasInChannel =
  <E>(rolesCache: RolesCache<E>, permission: bigint) =>
  (
    channel: Discord.GuildChannelResponse,
    memberOrRole: Discord.GuildMemberResponse | Discord.GuildRoleResponse,
  ) =>
    Effect.map(rolesCache.getForParent(channel.guild_id!), roles => {
      const channelPerms = forChannel([...roles.values()])(channel)(
        memberOrRole,
      )
      return has(permission)(channelPerms)
    })

export const hasInGuild =
  <E>(rolesCache: RolesCache<E>, permission: bigint) =>
  (guildId: Discord.Snowflake, member: Discord.GuildMemberResponse) =>
    Effect.map(rolesCache.getForParent(guildId), roles => {
      const hasPerm = has(permission)

      return member.roles.some(id => {
        const role = roles.get(id)
        return role ? hasPerm(role.permissions) : false
      })
    })
