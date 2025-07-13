import * as Effect from "effect/Effect"
import type * as Scope from "effect/Scope"
import * as Stream from "effect/Stream"
import type { DiscordRESTError } from "dfx/DiscordREST"
import { DiscordREST } from "dfx/DiscordREST"
import type {
  CacheDriver,
  CacheOp,
  ParentCacheDriver,
  ParentCacheOp,
  Cache,
  ParentCache,
} from "dfx/Cache"
import { CacheMissError, make, makeWithParent } from "dfx/Cache"
import { DiscordGateway } from "dfx/DiscordGateway"
import type * as Discord from "dfx/types"

export interface OptsWithParentOptions<E, A> {
  readonly id: (a: A) => string
  readonly fromParent: Stream.Stream<
    [parentId: string, resources: ReadonlyArray<A>],
    E
  >
  readonly create: Stream.Stream<[parentId: string, resource: A], E>
  readonly update: Stream.Stream<[parentId: string, resource: A], E>
  readonly remove: Stream.Stream<[parentId: string, id: string], E>
  readonly parentRemove: Stream.Stream<string, E>
}

export const opsWithParent = <E, T>({
  create,
  fromParent,
  id,
  parentRemove,
  remove,
  update,
}: OptsWithParentOptions<E, T>): Stream.Stream<ParentCacheOp<T>, E> => {
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
  create: Stream.Stream<A, E>
  update: Stream.Stream<A, E>
  remove: Stream.Stream<string, E>
}

export const ops = <E, T>({
  create,
  id,
  remove,
  update,
}: OpsOptions<E, T>): Stream.Stream<CacheOp<T>, E> => {
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
  makeDriver: Effect.Effect<CacheDriver<E, Discord.GuildResponse>, EM, RM>,
): Effect.Effect<
  Cache<E, DiscordRESTError, Discord.GuildResponse>,
  EM,
  RM | DiscordGateway | DiscordREST | Scope.Scope
> =>
  Effect.gen(function* () {
    const driver = yield* makeDriver
    const gateway = yield* DiscordGateway
    const rest = yield* DiscordREST

    return yield* make({
      driver,
      id: _ => _.id,
      ops: ops({
        id: (g: Discord.GuildResponse) => g.id,
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
      onMiss: id => rest.getGuild(id, {}),
    })
  })

export const channels = <RM, EM, E>(
  makeDriver: Effect.Effect<
    ParentCacheDriver<E, Discord.GetChannel200>,
    EM,
    RM
  >,
): Effect.Effect<
  ParentCache<E, DiscordRESTError, DiscordRESTError, Discord.GetChannel200>,
  EM,
  DiscordGateway | DiscordREST | RM | Scope.Scope
> =>
  Effect.gen(function* () {
    const driver = yield* makeDriver
    const gateway = yield* DiscordGateway
    const rest = yield* DiscordREST

    return yield* makeWithParent({
      driver,
      id: _ =>
        Effect.succeed([(_ as Discord.GuildChannelResponse).guild_id, _.id]),
      ops: opsWithParent({
        id: (a: Discord.GetChannel200) => a.id,
        fromParent: Stream.map(gateway.fromDispatch("GUILD_CREATE"), g => [
          g.id,
          g.channels.concat(g.threads as any),
        ]),
        create: Stream.merge(
          gateway.fromDispatch("CHANNEL_CREATE"),
          gateway.fromDispatch("THREAD_CREATE"),
        ).pipe(Stream.map(c => [c.guild_id, c])),
        update: Stream.merge(
          gateway.fromDispatch("CHANNEL_UPDATE"),
          gateway.fromDispatch("THREAD_UPDATE"),
        ).pipe(Stream.map(c => [c.guild_id, c])),
        remove: Stream.merge(
          gateway.fromDispatch("CHANNEL_DELETE"),
          gateway.fromDispatch("THREAD_DELETE"),
        ).pipe(Stream.map(a => [a.guild_id, a.id])),
        parentRemove: Stream.map(
          gateway.fromDispatch("GUILD_DELETE"),
          g => g.id,
        ),
      }),
      onMiss: (_, id) => rest.getChannel(id),
      onParentMiss: guildId =>
        Effect.map(rest.listGuildChannels(guildId), a =>
          a.map(a => [a.id, a as Discord.GetChannel200] as const),
        ),
    })
  })

export const roles = <RM, EM, E>(
  makeDriver: Effect.Effect<
    ParentCacheDriver<E, Discord.GuildRoleResponse>,
    EM,
    RM
  >,
): Effect.Effect<
  ParentCache<E, CacheMissError, DiscordRESTError, Discord.GuildRoleResponse>,
  EM,
  DiscordGateway | DiscordREST | RM | Scope.Scope
> =>
  Effect.gen(function* () {
    const driver = yield* makeDriver
    const gateway = yield* DiscordGateway
    const rest = yield* DiscordREST

    return yield* makeWithParent({
      driver,
      id: _ =>
        Effect.fail(
          new CacheMissError({ cacheName: "RolesCache/id", id: _.id }),
        ),
      ops: opsWithParent({
        id: (a: Discord.GuildRoleResponse) => a.id,
        fromParent: Stream.map(gateway.fromDispatch("GUILD_CREATE"), g => [
          g.id,
          g.roles,
        ]),
        create: Stream.map(
          gateway.fromDispatch("GUILD_ROLE_CREATE"),
          (r: Discord.GatewayGuildRoleCreateDispatchData) => [
            r.guild_id,
            r.role,
          ],
        ),
        update: Stream.map(
          gateway.fromDispatch("GUILD_ROLE_UPDATE"),
          (r: Discord.GatewayGuildRoleUpdateDispatchData) => [
            r.guild_id,
            r.role,
          ],
        ),
        remove: Stream.map(gateway.fromDispatch("GUILD_ROLE_DELETE"), r => [
          r.guild_id,
          r.role_id,
        ]),
        parentRemove: Stream.map(
          gateway.fromDispatch("GUILD_DELETE"),
          g => g.id,
        ),
      }),
      onMiss: (_, id) =>
        Effect.fail(new CacheMissError({ cacheName: "RolesCache", id })),
      onParentMiss: guildId =>
        rest
          .listGuildRoles(guildId)
          .pipe(Effect.map(_ => _.map(role => [role.id, role]))),
    })
  })
