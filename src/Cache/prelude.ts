import { DiscordREST } from "dfx"
import { DiscordGateway } from "dfx/gateway"
import {
  CacheDriver,
  CacheMissError,
  CacheOp,
  ParentCacheDriver,
  ParentCacheOp,
  make,
  makeWithParent,
} from "dfx/Cache"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import { Tag } from "@effect/data/Context"
import * as Option from "@effect/data/Option"
import * as Stream from "@effect/stream/Stream"
import { pipe, identity } from "@effect/data/Function"
import * as Ref from "@effect/io/Ref"
import * as Discord from "dfx/types"

export interface OptsWithParentOptions<E, A> {
  readonly id: (a: A) => string
  readonly fromParent: Stream.Stream<
    never,
    E,
    [parentId: string, resources: A[]]
  >
  readonly create: Stream.Stream<never, E, [parentId: string, resource: A]>
  readonly update: Stream.Stream<never, E, [parentId: string, resource: A]>
  readonly remove: Stream.Stream<never, E, [parentId: string, id: string]>
  readonly parentRemove: Stream.Stream<never, E, string>
}

export const opsWithParent = <E, T>({
  id,
  fromParent,
  create,
  update,
  remove,
  parentRemove,
}: OptsWithParentOptions<E, T>) => {
  const fromParentOps = Stream.flatMap(fromParent, ([parentId, a]) =>
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

  const createOps = Stream.map(
    create,
    ([parentId, resource]): ParentCacheOp<T> => ({
      op: "create",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = Stream.map(
    update,
    ([parentId, resource]): ParentCacheOp<T> => ({
      op: "update",
      parentId,
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = Stream.map(
    remove,
    ([parentId, resourceId]): ParentCacheOp<T> => ({
      op: "delete",
      parentId,
      resourceId,
    }),
  )

  const parentRemoveOps = Stream.map(
    parentRemove,
    (parentId): ParentCacheOp<T> => ({
      op: "parentDelete",
      parentId,
    }),
  )

  return Stream.merge(fromParentOps, createOps).pipe(
    Stream.merge(updateOps),
    Stream.merge(removeOps),
    Stream.merge(parentRemoveOps),
  )
}

export interface OpsOptions<E, A> {
  id: (a: A) => string
  create: Stream.Stream<never, E, A>
  update: Stream.Stream<never, E, A>
  remove: Stream.Stream<never, E, string>
}

export const ops = <E, T>({ id, create, update, remove }: OpsOptions<E, T>) => {
  const createOps = Stream.map(
    create,
    (resource): CacheOp<T> => ({
      op: "create",
      resourceId: id(resource),
      resource,
    }),
  )

  const updateOps = Stream.map(
    update,
    (resource): CacheOp<T> => ({
      op: "update",
      resourceId: id(resource),
      resource,
    }),
  )

  const removeOps = Stream.map(
    remove,
    (resourceId): CacheOp<T> => ({
      op: "delete",
      resourceId,
    }),
  )

  return Stream.merge(createOps, updateOps).pipe(Stream.merge(removeOps))
}

export const guilds = <RM, EM, E>(
  makeDriver: Effect.Effect<RM, EM, CacheDriver<E, Discord.Guild>>,
) =>
  Effect.gen(function* (_) {
    const driver = yield* _(makeDriver)
    const gateway = yield* _(DiscordGateway)
    const rest = yield* _(DiscordREST)

    return make({
      driver,
      id: _ => _.id,
      ops: ops({
        id: (g: Discord.Guild) => g.id,
        create: Stream.map(gateway.fromDispatch("GUILD_CREATE"), g => ({
          ...g,
          channels: [],
          roles: [],
          emojis: [],
          members: [],
        })),
        update: gateway.fromDispatch("GUILD_UPDATE"),
        remove: Stream.map(gateway.fromDispatch("GUILD_DELETE"), a => a.id),
      }),
      onMiss: id => Effect.flatMap(rest.getGuild(id), r => r.json),
    })
  })

export const channels = <RM, EM, E>(
  makeDriver: Effect.Effect<RM, EM, ParentCacheDriver<E, Discord.Channel>>,
) =>
  Effect.gen(function* (_) {
    const driver = yield* _(makeDriver)
    const gateway = yield* _(DiscordGateway)
    const rest = yield* _(DiscordREST)

    return makeWithParent({
      driver,
      id: _ => Effect.succeed([_.guild_id!, _.id]),
      ops: opsWithParent({
        id: (a: Discord.Channel) => a.id,
        fromParent: Stream.map(gateway.fromDispatch("GUILD_CREATE"), g => [
          g.id,
          g.channels.concat(g.threads),
        ]),
        create: Stream.merge(
          gateway.fromDispatch("CHANNEL_CREATE"),
          gateway.fromDispatch("THREAD_CREATE"),
        ).pipe(Stream.map(c => [c.guild_id!, c])),
        update: Stream.merge(
          gateway.fromDispatch("CHANNEL_UPDATE"),
          gateway.fromDispatch("THREAD_UPDATE"),
        ).pipe(Stream.map(c => [c.guild_id!, c])),
        remove: Stream.merge(
          gateway.fromDispatch("CHANNEL_DELETE"),
          gateway.fromDispatch("THREAD_DELETE"),
        ).pipe(Stream.map(a => [a.guild_id!, a.id])),
        parentRemove: Stream.map(
          gateway.fromDispatch("GUILD_DELETE"),
          g => g.id,
        ),
      }),
      onMiss: (_, id) => Effect.flatMap(rest.getChannel(id), r => r.json),
      onParentMiss: guildId =>
        rest.getGuildChannels(guildId).pipe(
          Effect.flatMap(r => r.json),
          Effect.map(a => a.map(a => [a.id, a])),
        ),
    })
  })

export const roles = <RM, EM, E>(
  makeDriver: Effect.Effect<RM, EM, ParentCacheDriver<E, Discord.Role>>,
) =>
  Effect.gen(function* (_) {
    const driver = yield* _(makeDriver)
    const gateway = yield* _(DiscordGateway)
    const rest = yield* _(DiscordREST)

    return makeWithParent({
      driver,
      id: _ => Effect.fail(new CacheMissError("RolesCache/id", _.id)),
      ops: opsWithParent({
        id: (a: Discord.Role) => a.id,
        fromParent: Stream.map(gateway.fromDispatch("GUILD_CREATE"), g => [
          g.id,
          g.roles,
        ]),
        create: Stream.map(gateway.fromDispatch("GUILD_ROLE_CREATE"), r => [
          r.guild_id,
          r.role,
        ]),
        update: Stream.map(gateway.fromDispatch("GUILD_ROLE_UPDATE"), r => [
          r.guild_id,
          r.role,
        ]),
        remove: Stream.map(gateway.fromDispatch("GUILD_ROLE_DELETE"), r => [
          r.guild_id,
          r.role_id,
        ]),
        parentRemove: Stream.map(
          gateway.fromDispatch("GUILD_DELETE"),
          g => g.id,
        ),
      }),
      onMiss: (_, id) => Effect.fail(new CacheMissError("RolesCache", id)),
      onParentMiss: guildId =>
        rest.getGuildRoles(guildId).pipe(
          Effect.flatMap(r => r.json),
          Effect.map(_ => _.map(role => [role.id, role])),
        ),
    })
  })
