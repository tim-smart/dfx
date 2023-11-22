import * as Chunk from "effect/Chunk"
import { Tag } from "effect/Context"
import * as Duration from "effect/Duration"
import { pipe } from "effect/Function"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import * as Http from "@effect/platform/HttpClient"
import { DiscordGateway } from "dfx/DiscordGateway"
import type { DiscordRESTError } from "dfx/DiscordREST"
import { DiscordREST } from "dfx/DiscordREST"
import type {
  GlobalApplicationCommand,
  GuildApplicationCommand,
} from "dfx/Interactions/definitions"
import type { DefinitionNotFound } from "dfx/Interactions/handlers"
import { handlers } from "dfx/Interactions/handlers"
import type { InteractionBuilder } from "dfx/Interactions/index"
import { builder, Interaction } from "dfx/Interactions/index"
import type * as Discord from "dfx/types"
import * as EffectUtils from "dfx/utils/Effect"
import * as Schedule from "effect/Schedule"

export interface RunOpts {
  sync?: boolean
}

/**
 * @tsplus pipeable dfx/InteractionBuilder runGateway
 */
export const run =
  <R, R2, E, TE, E2>(
    postHandler: (
      effect: Effect.Effect<
        R | DiscordREST | Discord.Interaction,
        TE | DiscordRESTError | DefinitionNotFound,
        void
      >,
    ) => Effect.Effect<R2, E2, void>,
    { sync = true }: RunOpts = {},
  ) =>
  (
    ix: InteractionBuilder<R, E, TE>,
  ): Effect.Effect<
    DiscordREST | DiscordGateway | Exclude<R2, Discord.Interaction>,
    E2 | DiscordRESTError | Http.error.ResponseError,
    never
  > =>
    Effect.gen(function* (_) {
      const GlobalApplicationCommand = ix.definitions.pipe(
        Chunk.map(_ => _[0]),
        Chunk.filter(
          (_): _ is GlobalApplicationCommand<R, E> =>
            _._tag === "GlobalApplicationCommand",
        ),
        Chunk.toReadonlyArray,
      )
      const GuildApplicationCommand = ix.definitions.pipe(
        Chunk.map(_ => _[0]),
        Chunk.filter(
          (_): _ is GuildApplicationCommand<R, E> =>
            _._tag === "GuildApplicationCommand",
        ),
        Chunk.toReadonlyArray,
      )

      const gateway = yield* _(DiscordGateway)
      const rest = yield* _(DiscordREST)

      const application = yield* _(
        rest.getCurrentBotApplicationInformation(),
        Effect.flatMap(a => a.json),
      )

      const globalSync = rest.bulkOverwriteGlobalApplicationCommands(
        application.id,
        {
          body: Http.body.unsafeJson(
            GlobalApplicationCommand.map(_ => _.command),
          ),
        },
      )

      const guildSync = GuildApplicationCommand.length
        ? gateway.handleDispatch("GUILD_CREATE", a =>
            rest.bulkOverwriteGuildApplicationCommands(
              application.id,
              a.id,
              GuildApplicationCommand.map(_ => _.command) as any,
            ),
          )
        : Effect.never

      const handle = handlers(ix.definitions, (i, r) =>
        rest.createInteractionResponse(i.id, i.token, r),
      )

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        Effect.provideService(postHandler(handle[i.type](i)), Interaction, i),
      )

      return yield* _(
        sync
          ? Effect.forever(
              Effect.all([run, globalSync, guildSync], {
                concurrency: "unbounded",
                discard: true,
              }),
            )
          : run,
      )
    })

const makeRegistry = (options?: RunOpts) =>
  Effect.gen(function* (_) {
    const ref = yield* _(
      Ref.make(builder as InteractionBuilder<never, never, never>),
    )
    const queue = yield* _(
      Queue.sliding<InteractionBuilder<never, never, never>>(1),
    )

    const register = <E>(ix: InteractionBuilder<never, E, never>) =>
      Effect.flatMap(
        Ref.updateAndGet(ref, _ => _.concat(ix as any)),
        _ => Queue.offer(queue, _),
      )

    yield* _(
      EffectUtils.foreverSwitch(Queue.take(queue), ix =>
        pipe(
          ix,
          run(
            Effect.catchAllCause(_ => Effect.logError("unhandled error", _)),
            options,
          ),
          Effect.delay(Duration.seconds(0.1)),
        ),
      ),
      Effect.tapErrorCause(_ => Effect.logError("registry error", _)),
      Effect.retry(
        Schedule.exponential("1 seconds").pipe(
          Schedule.union(Schedule.spaced("20 seconds")),
        ),
      ),
      Effect.forkScoped,
    )

    return { register } as const
  }).pipe(
    Effect.annotateLogs({
      package: "dfx",
      service: "InteractionsRegistry",
    }),
  )

export interface InteractionsRegistry {
  readonly register: <E>(
    ix: InteractionBuilder<never, E, never>,
  ) => Effect.Effect<never, never, void>
}

export const InteractionsRegistry = Tag<InteractionsRegistry>()
export const InteractionsRegistryLive = (options?: RunOpts) =>
  Layer.scoped(InteractionsRegistry, makeRegistry(options))
