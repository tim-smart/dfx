import { ParentCacheOp, CacheOp } from "./index.js"

export interface OpsSourceOpts<E, A> {
  id: (a: A) => string
  fromParent: EffectSource<never, E, [parentId: string, resources: A[]]>
  create: EffectSource<never, E, [parentId: string, resource: A]>
  update: EffectSource<never, E, [parentId: string, resource: A]>
  remove: EffectSource<never, E, [parentId: string, id: string]>
  parentRemove: EffectSource<never, E, string>
}

export const source = <R, E, T>({
  id,
  fromParent,
  create,
  update,
  remove,
  parentRemove,
}: OpsSourceOpts<E, T>) => {
  const fromParentOps = fromParent.chain(([parentId, a]) =>
    EffectSource.fromIterable(
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

export interface NonParentOpsSourceOpts<E, A> {
  id: (a: A) => string
  create: EffectSource<never, E, A>
  update: EffectSource<never, E, A>
  remove: EffectSource<never, E, string>
}

export const nonParentSource = <R, E, T>({
  id,
  create,
  update,
  remove,
}: NonParentOpsSourceOpts<E, T>) => {
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

// Guilds
export const guilds = Do(($) => {
  const gateway = $(Effect.service(Gateway.DiscordGateway))

  return nonParentSource({
    id: (g: Discord.Guild) => g.id,
    create: gateway.fromDispatch("GUILD_CREATE").map((g) => ({
      ...g,
      channels: [],
      roles: [],
      emojis: [],
      members: [],
    })),
    update: gateway.fromDispatch("GUILD_UPDATE"),
    remove: gateway.fromDispatch("GUILD_DELETE").map((a) => a.id),
  })
})

// Channels
export const channels = Do(($) => {
  const gateway = $(Effect.service(Gateway.DiscordGateway))
  return source({
    id: (a: Discord.Channel) => a.id,
    fromParent: gateway
      .fromDispatch("GUILD_CREATE")
      .map((g) => [g.id, g.channels]),
    create: gateway.fromDispatch("CHANNEL_CREATE").map((c) => [c.guild_id!, c]),
    update: gateway.fromDispatch("CHANNEL_UPDATE").map((c) => [c.guild_id!, c]),
    remove: gateway
      .fromDispatch("CHANNEL_DELETE")
      .map((a) => [a.guild_id!, a.id]),
    parentRemove: gateway.fromDispatch("GUILD_DELETE").map((g) => g.id),
  })
})

// Roles
export const roles = Do(($) => {
  const gateway = $(Effect.service(Gateway.DiscordGateway))
  return source({
    id: (a: Discord.Role) => a.id,
    fromParent: gateway
      .fromDispatch("GUILD_CREATE")
      .map((g) => [g.id, g.roles]),
    create: gateway
      .fromDispatch("GUILD_ROLE_CREATE")
      .map((r) => [r.guild_id, r.role]),
    update: gateway
      .fromDispatch("GUILD_ROLE_UPDATE")
      .map((r) => [r.guild_id, r.role]),
    remove: gateway
      .fromDispatch("GUILD_ROLE_DELETE")
      .map((a) => [a.guild_id, a.role_id]),
    parentRemove: gateway.fromDispatch("GUILD_DELETE").map((g) => g.id),
  })
})
