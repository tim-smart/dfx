import { DiscordREST } from "dfx"
import { Gateway } from "dfx/gateway"
import { Discord, Effect, Stream } from "dfx/_common"
import {
  CacheDriver,
  CacheMissError,
  CacheOp,
  make,
  makeWithParent,
  ParentCacheDriver,
  ParentCacheOp,
} from "../Cache.js"

export interface OptsWithParentOptions<E, A> {
  id: (a: A) => string
  fromParent: Stream<never, E, [parentId: string, resources: A[]]>
  create: Stream<never, E, [parentId: string, resource: A]>
  update: Stream<never, E, [parentId: string, resource: A]>
  remove: Stream<never, E, [parentId: string, id: string]>
  parentRemove: Stream<never, E, string>
}

export const opsWithParent = <E, T>({
  id,
  fromParent,
  create,
  update,
  remove,
  parentRemove,
}: OptsWithParentOptions<E, T>) => {
  const fromParentOps = fromParent.flatMap(([parentId, a]) =>
    Stream.fromIterable(
      a.map(
        (resource): ParentCacheOp<T> => ({
          op: "create",
          parentId,
          resourceId: id(resource),
          resource,
        }),
      ),
    ),
  )

  const createOps = create.map(
    ([parentId, resource]): ParentCacheOp<T> => ({
      op: "create",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = update.map(
    ([parentId, resource]): ParentCacheOp<T> => ({
      op: "update",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = remove.map(
    ([parentId, resourceId]): ParentCacheOp<T> => ({
      op: "delete",
      parentId,
      resourceId,
    }),
  )

  const parentRemoveOps = parentRemove.map(
    (parentId): ParentCacheOp<T> => ({
      op: "parentDelete",
      parentId,
    }),
  )

  return fromParentOps
    .merge(createOps)
    .merge(updateOps)
    .merge(removeOps)
    .merge(parentRemoveOps)
}

export interface OpsOptions<E, A> {
  id: (a: A) => string
  create: Stream<never, E, A>
  update: Stream<never, E, A>
  remove: Stream<never, E, string>
}

export const ops = <E, T>({ id, create, update, remove }: OpsOptions<E, T>) => {
  const createOps = create.map(
    (resource): CacheOp<T> => ({
      op: "create",
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = update.map(
    (resource): CacheOp<T> => ({
      op: "update",
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = remove.map(
    (resourceId): CacheOp<T> => ({
      op: "delete",
      resourceId,
    }),
  )

  return createOps.merge(updateOps).merge(removeOps)
}

export const guilds = <RM, EM, E>(
  makeDriver: Effect<RM, EM, CacheDriver<E, Discord.Guild>>,
) =>
  Do($ => {
    const driver = $(makeDriver)
    const gateway = $(Effect.service(Gateway.DiscordGateway))
    const rest = $(Effect.service(DiscordREST))

    return make({
      driver,
      ops: ops({
        id: (g: Discord.Guild) => g.id,
        create: gateway.fromDispatch("GUILD_CREATE").map(g => ({
          ...g,
          channels: [],
          roles: [],
          emojis: [],
          members: [],
        })),
        update: gateway.fromDispatch("GUILD_UPDATE"),
        remove: gateway.fromDispatch("GUILD_DELETE").map(a => a.id),
      }),
      onMiss: id => rest.getGuild(id).flatMap(r => r.json),
    })
  })

export const channels = <RM, EM, E>(
  makeDriver: Effect<RM, EM, ParentCacheDriver<E, Discord.Channel>>,
) =>
  Do($ => {
    const driver = $(makeDriver)
    const gateway = $(Effect.service(Gateway.DiscordGateway))
    const rest = $(Effect.service(DiscordREST))

    return makeWithParent({
      driver,
      ops: opsWithParent({
        id: (a: Discord.Channel) => a.id,
        fromParent: gateway
          .fromDispatch("GUILD_CREATE")
          .map(g => [g.id, g.channels]),
        create: gateway
          .fromDispatch("CHANNEL_CREATE")
          .map(c => [c.guild_id!, c]),
        update: gateway
          .fromDispatch("CHANNEL_UPDATE")
          .map(c => [c.guild_id!, c]),
        remove: gateway
          .fromDispatch("CHANNEL_DELETE")
          .map(a => [a.guild_id!, a.id]),
        parentRemove: gateway.fromDispatch("GUILD_DELETE").map(g => g.id),
      }),
      onMiss: id => rest.getChannel(id).flatMap(r => r.json),
      onParentMiss: guildId =>
        rest
          .getGuildChannels(guildId)
          .flatMap(r => r.json)
          .map(a => a.map(a => [a.id, a])),
    })
  })

export const roles = <RM, EM, E>(
  makeDriver: Effect<RM, EM, ParentCacheDriver<E, Discord.Role>>,
) =>
  Do($ => {
    const driver = $(makeDriver)
    const gateway = $(Effect.service(Gateway.DiscordGateway))
    const rest = $(Effect.service(DiscordREST))

    return makeWithParent({
      driver,
      ops: opsWithParent({
        id: (a: Discord.Role) => a.id,
        fromParent: gateway
          .fromDispatch("GUILD_CREATE")
          .map(g => [g.id, g.roles]),
        create: gateway
          .fromDispatch("GUILD_ROLE_CREATE")
          .map(r => [r.guild_id, r.role]),
        update: gateway
          .fromDispatch("GUILD_ROLE_UPDATE")
          .map(r => [r.guild_id, r.role]),
        remove: gateway
          .fromDispatch("GUILD_ROLE_DELETE")
          .map(a => [a.guild_id, a.role_id]),
        parentRemove: gateway.fromDispatch("GUILD_DELETE").map(g => g.id),
      }),
      onMiss: id => Effect.fail(new CacheMissError("RolesCache", id)),
      onParentMiss: guildId =>
        rest
          .getGuildRoles(guildId)
          .flatMap(r => r.json)
          .map(a => a.map(a => [a.id, a])),
    })
  })
