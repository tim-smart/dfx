import { ParentCacheOp, CacheOp } from "./index.js"

export interface OpsSourceOpts<R, E, A> {
  id: (a: A) => string
  fromParent: EffectSource<R, E, [parentId: string, resources: A[]]>
  create: EffectSource<R, E, [parentId: string, resource: A]>
  update: EffectSource<R, E, [parentId: string, resource: A]>
  remove: EffectSource<R, E, [parentId: string, id: string]>
  parentRemove: EffectSource<R, E, string>
}

export const source = <R, E, T>({
  id,
  fromParent,
  create,
  update,
  remove,
  parentRemove,
}: OpsSourceOpts<R, E, T>) => {
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

export interface NonParentOpsSourceOpts<R, E, A> {
  id: (a: A) => string
  create: EffectSource<R, E, A>
  update: EffectSource<R, E, A>
  remove: EffectSource<R, E, string>
}

export const nonParentSource = <R, E, T>({
  id,
  create,
  update,
  remove,
}: NonParentOpsSourceOpts<R, E, T>) => {
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
export const guilds = nonParentSource({
  id: (g: Discord.Guild) => g.id,
  create: Gateway.fromDispatch("GUILD_CREATE").map((g) => ({
    ...g,
    channels: [],
    roles: [],
    emojis: [],
    members: [],
  })),
  update: Gateway.fromDispatch("GUILD_UPDATE"),
  remove: Gateway.fromDispatch("GUILD_DELETE").map((a) => a.id),
})

// Channels
export const channels = source({
  id: (a: Discord.Channel) => a.id,
  fromParent: Gateway.fromDispatch("GUILD_CREATE").map((g) => [
    g.id,
    g.channels,
  ]),
  create: Gateway.fromDispatch("CHANNEL_CREATE").map((c) => [c.guild_id!, c]),
  update: Gateway.fromDispatch("CHANNEL_UPDATE").map((c) => [c.guild_id!, c]),
  remove: Gateway.fromDispatch("CHANNEL_DELETE").map((a) => [
    a.guild_id!,
    a.id,
  ]),
  parentRemove: Gateway.fromDispatch("GUILD_DELETE").map((g) => g.id),
})

// Roles
export const roles = source({
  id: (a: Discord.Role) => a.id,
  fromParent: Gateway.fromDispatch("GUILD_CREATE").map((g) => [g.id, g.roles]),
  create: Gateway.fromDispatch("GUILD_ROLE_CREATE").map((r) => [
    r.guild_id,
    r.role,
  ]),
  update: Gateway.fromDispatch("GUILD_ROLE_UPDATE").map((r) => [
    r.guild_id,
    r.role,
  ]),
  remove: Gateway.fromDispatch("GUILD_ROLE_DELETE").map((a) => [
    a.guild_id,
    a.role_id,
  ]),
  parentRemove: Gateway.fromDispatch("GUILD_DELETE").map((g) => g.id),
})
