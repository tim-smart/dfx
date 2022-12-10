import { Effect } from "@effect/io/Effect"
import { Cache } from "dfx"
import { CacheOps } from "dfx/gateway"

export const guilds = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.CacheDriver<E, Discord.Guild>>,
) =>
  Cache.make({
    driver,
    ops: CacheOps.guilds,
    onMiss: (id) => rest.getGuild(id).flatMap((r) => r.json),
  })

export const channels = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheDriver<E, Discord.Channel>>,
) =>
  Cache.makeParent({
    driver,
    ops: CacheOps.channels,
    onMiss: (id) => rest.getChannel(id).flatMap((r) => r.json),
    onParentMiss: (guildId) =>
      rest
        .getGuildChannels(guildId)
        .flatMap((r) => r.json)
        .map((a) => a.map((a) => [a.id, a])),
  })

export const roles = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheDriver<E, Discord.Role>>,
) =>
  Cache.makeParent({
    driver,
    ops: CacheOps.roles,
    onMiss: (id) => Effect.fail(new Cache.CacheMissError("RolesCache", id)),
    onParentMiss: (guildId) =>
      rest
        .getGuildRoles(guildId)
        .flatMap((r) => r.json)
        .map((a) => a.map((a) => [a.id, a])),
  })
