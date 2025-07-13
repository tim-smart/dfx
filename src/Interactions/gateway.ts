import * as Chunk from "effect/Chunk"
import type { Tag } from "effect/Context"
import { GenericTag } from "effect/Context"
import * as Duration from "effect/Duration"
import { pipe } from "effect/Function"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import { DiscordGateway } from "dfx/DiscordGateway"
import type { DiscordRESTError } from "dfx/DiscordREST"
import { DiscordREST } from "dfx/DiscordREST"
import type {
  GlobalApplicationCommand,
  GuildApplicationCommand,
} from "dfx/Interactions/definitions"
import type { DefinitionNotFound } from "dfx/Interactions/handlers"
import { handlers } from "dfx/Interactions/handlers"
import type {
  DiscordInteraction,
  InteractionBuilder,
} from "dfx/Interactions/index"
import { builder, Interaction } from "dfx/Interactions/index"
import * as EffectUtils from "dfx/utils/Effect"
import * as Schedule from "effect/Schedule"
import { globalValue } from "effect/GlobalValue"
import * as FiberRef from "effect/FiberRef"
import type { ListMyGuilds200, MyGuildResponse } from "dfx/types"
import * as Arr from "effect/Array"

export const interactionsSync: FiberRef.FiberRef<boolean> = globalValue(
  "dfx/Interactions/sync",
  () => FiberRef.unsafeMake(true),
)

export const setInteractionsSync = (enabled: boolean) =>
  Layer.locally(interactionsSync, enabled)

export const run =
  <R, R2, E, TE, E2>(
    postHandler: (
      effect: Effect.Effect<
        void,
        TE | DiscordRESTError | DefinitionNotFound,
        R | DiscordREST | DiscordInteraction
      >,
    ) => Effect.Effect<void, E2, R2>,
  ) =>
  (
    ix: InteractionBuilder<R, E, TE>,
  ): Effect.Effect<
    never,
    E2 | DiscordRESTError,
    DiscordREST | DiscordGateway | Exclude<R2, DiscordInteraction>
  > =>
    Effect.gen(function* () {
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

      const gateway = yield* DiscordGateway
      const rest = yield* DiscordREST

      const application = yield* rest.getMyApplication()

      const globalSync = rest.bulkSetApplicationCommands(
        application.id,
        GlobalApplicationCommand.map(_ => _.command),
      )

      const runGuildSync = Effect.gen(function* () {
        const commands = GuildApplicationCommand.map(_ => _.command)
        let results: Arr.NonEmptyReadonlyArray<MyGuildResponse> | undefined =
          undefined
        while (true) {
          const next: ListMyGuilds200 = yield* rest.listMyGuilds({
            after: results && Arr.lastNonEmpty(results).id,
          })
          if (!Arr.isNonEmptyReadonlyArray(next)) break
          results = next
          yield* Effect.forEach(
            results!,
            guild =>
              rest.bulkSetGuildApplicationCommands(
                application.id,
                guild.id,
                commands,
              ),
            { concurrency: "unbounded", discard: true },
          )
        }

        return yield* gateway.handleDispatch("GUILD_CREATE", a =>
          rest.bulkSetGuildApplicationCommands(
            application.id,
            a.id,
            GuildApplicationCommand.map(_ => _.command),
          ),
        )
      })

      const guildSync = GuildApplicationCommand.length
        ? runGuildSync
        : Effect.never

      const handle = handlers(ix.definitions, (i, r) => {
        const hasFiles = "files" in r
        const payload = hasFiles ? { ...r, files: undefined } : r
        const effect = rest.createInteractionResponse(i.id, i.token, {
          payload,
        })
        return hasFiles ? rest.withFiles(r.files as any)(effect) : effect
      })

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        Effect.withSpan(
          Effect.provideService(postHandler(handle[i.type](i)), Interaction, i),
          "dfx.Interaction",
          { attributes: { interactionId: i.id }, captureStackTrace: false },
        ),
      )

      const sync = yield* FiberRef.get(interactionsSync)

      return yield* sync
        ? Effect.forever(
            Effect.all([run, globalSync, guildSync], {
              concurrency: "unbounded",
              discard: true,
            }),
          )
        : run
    })

const makeRegistry = Effect.gen(function* () {
  const ref = yield* Ref.make(
    builder as InteractionBuilder<never, never, never>,
  )
  const queue = yield* Queue.sliding<InteractionBuilder<never, never, never>>(1)

  const register = <E>(ix: InteractionBuilder<never, E, never>) =>
    Effect.flatMap(
      Ref.updateAndGet(ref, _ => _.concat(ix as any)),
      _ => Queue.offer(queue, _),
    )

  yield* EffectUtils.foreverSwitch(Queue.take(queue), ix =>
    pipe(
      ix,
      run(Effect.catchAllCause(_ => Effect.logError("unhandled error", _))),
      Effect.delay(Duration.seconds(5)),
    ),
  ).pipe(
    Effect.tapErrorCause(_ => Effect.logError("registry error", _)),
    Effect.retry(
      Schedule.exponential("1 seconds").pipe(
        Schedule.union(Schedule.spaced("20 seconds")),
      ),
    ),
    Effect.forkScoped,
    Effect.interruptible,
  )

  return { register } as const
}).pipe(
  Effect.annotateLogs({
    package: "dfx",
    service: "InteractionsRegistry",
  }),
)

export interface InteractionsRegistryService {
  readonly register: <E>(
    ix: InteractionBuilder<never, E, never>,
  ) => Effect.Effect<void>
}
export interface InteractionsRegistry {
  readonly _: unique symbol
}

export const InteractionsRegistry: Tag<
  InteractionsRegistry,
  InteractionsRegistryService
> = GenericTag<InteractionsRegistry, InteractionsRegistryService>(
  "dfx/Interactions/InteractionsRegistry",
)

export const InteractionsRegistryLive: Layer.Layer<
  InteractionsRegistry,
  never,
  DiscordREST | DiscordGateway
> = Layer.scoped(InteractionsRegistry, makeRegistry)
