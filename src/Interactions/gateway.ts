import * as Arr from "effect/Array"
import * as Chunk from "effect/Chunk"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"
import * as ServiceMap from "effect/ServiceMap"
import { DiscordGateway } from "../DiscordGateway.ts"
import type { DiscordRESTError } from "../DiscordREST.ts"
import { DiscordREST } from "../DiscordREST.ts"
import type { ListMyGuilds200, MyGuildResponse } from "../types.ts"
import type {
  GlobalApplicationCommand,
  GuildApplicationCommand,
} from "./definitions.ts"
import type { DefinitionNotFound } from "./handlers.ts"
import { handlers } from "./handlers.ts"
import type { DiscordInteraction, InteractionBuilder } from "./index.ts"
import { builder, Interaction } from "./index.ts"
import * as EffectUtils from "../utils/Effect.ts"

export const interactionsSync = ServiceMap.Reference("dfx/Interactions/sync", {
  defaultValue: () => true,
})

export const setInteractionsSync = (enabled: boolean) =>
  Layer.provide(Layer.succeed(interactionsSync, enabled))

const retryPolicy = Schedule.exponential("1 seconds").pipe(
  Schedule.either(Schedule.spaced("20 seconds")),
)

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
          if (!Arr.isReadonlyArrayNonEmpty(next)) break
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

      const sync = yield* interactionsSync

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
      run(Effect.catchCause(_ => Effect.logError("unhandled error", _))),
      Effect.delay(Duration.seconds(5)),
    ),
  ).pipe(
    Effect.tapCause(_ => Effect.logError("registry error", _)),
    Effect.retry(retryPolicy),
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

export class InteractionsRegistry extends ServiceMap.Service<
  InteractionsRegistry,
  InteractionsRegistryService
>()("dfx/Interactions/InteractionsRegistry") {}

export const InteractionsRegistryLive: Layer.Layer<
  InteractionsRegistry,
  never,
  DiscordREST | DiscordGateway
> = Layer.effect(InteractionsRegistry, makeRegistry)
