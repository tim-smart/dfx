import { Effect } from "@effect/io/Effect"
import { Cache } from "dfx"
import { CacheOps } from "dfx/gateway"

export const guilds = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.CacheDriver<E, Discord.Guild>>,
) =>
  Do(($) => {
    const ops = $(CacheOps.guilds)
    const rest = $(Effect.service(DiscordREST))

    return Cache.make({
      driver,
      ops,
      onMiss: (id) => rest.routes.getGuild(id).flatMap((r) => r.json),
    })
  })

export const channels = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheDriver<E, Discord.Channel>>,
) =>
  Do(($) => {
    const ops = $(CacheOps.channels)
    const { routes: rest } = $(Effect.service(DiscordREST))

    return Cache.makeParent({
      driver,
      ops,
      onMiss: (id) => rest.getChannel(id).flatMap((r) => r.json),
      onParentMiss: (guildId) =>
        rest
          .getGuildChannels(guildId)
          .flatMap((r) => r.json)
          .map((a) => a.map((a) => [a.id, a])),
    })
  })

export const roles = <RM, EM, E>(
  driver: Effect<RM, EM, Cache.ParentCacheDriver<E, Discord.Role>>,
) =>
  Do(($) => {
    const ops = $(CacheOps.roles)
    const { routes: rest } = $(Effect.service(DiscordREST))

    return Cache.makeParent({
      driver,
      ops,
      onMiss: (id) => Effect.fail(new Cache.CacheMissError("RolesCache", id)),
      onParentMiss: (guildId) =>
        rest
          .getGuildRoles(guildId)
          .flatMap((r) => r.json)
          .map((a) => a.map((a) => [a.id, a])),
    })
  })
