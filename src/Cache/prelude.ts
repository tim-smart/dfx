import { Cache } from "dfx"
import { CacheOps } from "dfx/gateway"
import { Effect, toLayer } from "@effect/io/Effect"

const makeGuilds = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.CacheStoreDriver<E, Discord.Guild>>,
) =>
  Cache.make({
    driver,
    ops: CacheOps.guilds,
    onMiss: (id) => rest.getGuild(id).flatMap((r) => r.json),
  })

export interface GuildsCache extends Success<ReturnType<typeof makeGuilds>> {}
export const GuildsCache = Tag<GuildsCache>()
export const guilds = flow(makeGuilds, toLayer(GuildsCache))

const makeChannels = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheStoreDriver<E, Discord.Channel>>,
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

export interface ChannelsCache
  extends Success<ReturnType<typeof makeChannels>> {}
export const ChannelsCache = Tag<ChannelsCache>()
export const channels = flow(makeChannels, toLayer(ChannelsCache))

const makeRoles = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheStoreDriver<E, Discord.Role>>,
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

export interface RolesCache extends Success<ReturnType<typeof makeRoles>> {}
export const RolesCache = Tag<RolesCache>()
export const roles = flow(makeRoles, toLayer(RolesCache))
