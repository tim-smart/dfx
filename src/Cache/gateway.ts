import { CacheOp, NonParentCacheOp } from "./index.js"

export interface OpsSourceOpts<RFP, RC, RU, RD, RP, EFP, EC, EU, ED, EP, A> {
  id: (a: A) => string
  fromParent: EffectSource<RFP, EFP, [parentId: string, resources: A[]]>
  create: EffectSource<RC, EC, [parentId: string, resource: A]>
  update: EffectSource<RU, EU, [parentId: string, resource: A]>
  remove: EffectSource<RD, ED, [parentId: string, id: string]>
  parentRemove: EffectSource<RP, EP, string>
}

export const source = <RFP, RC, RU, RD, RP, EFP, EC, EU, ED, EP, T>({
  id,
  fromParent,
  create,
  update,
  remove,
  parentRemove,
}: OpsSourceOpts<RFP, RC, RU, RD, RP, EFP, EC, EU, ED, EP, T>) => {
  const fromParentOps = fromParent.chain(([parentId, a]) =>
    EffectSource.fromIterable(
      a.map(
        (resource): CacheOp<T> => ({
          op: "create",
          parentId,
          resourceId: id(resource),
          resource,
        }),
      ),
    ),
  )

  const createOps = create.map(
    ([parentId, resource]): CacheOp<T> => ({
      op: "create",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = update.map(
    ([parentId, resource]): CacheOp<T> => ({
      op: "update",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = remove.map(
    ([parentId, resourceId]): CacheOp<T> => ({
      op: "delete",
      parentId,
      resourceId,
    }),
  )

  const parentRemoveOps = parentRemove.map(
    (parentId): CacheOp<T> => ({
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

export interface NonParentOpsSourceOpts<RC, RU, RD, EC, EU, ED, A> {
  id: (a: A) => string
  create: EffectSource<RC, EC, A>
  update: EffectSource<RU, EU, A>
  remove: EffectSource<RD, ED, string>
}

export const nonParentSource = <RC, RU, RD, EC, EU, ED, T>({
  id,
  create,
  update,
  remove,
}: NonParentOpsSourceOpts<RC, RU, RD, EC, EU, ED, T>) => {
  const createOps = create.map(
    (resource): NonParentCacheOp<T> => ({
      op: "create",
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = update.map(
    (resource): NonParentCacheOp<T> => ({
      op: "update",
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = remove.map(
    (resourceId): NonParentCacheOp<T> => ({
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
