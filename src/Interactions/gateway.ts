import * as Chunk from "effect/Chunk"
import { GenericTag } from "effect/Context"
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
import type {
  DiscordInteraction,
  InteractionBuilder,
} from "dfx/Interactions/index"
import { builder, Interaction } from "dfx/Interactions/index"
import * as EffectUtils from "dfx/utils/Effect"
import * as Schedule from "effect/Schedule"
import { globalValue } from "effect/GlobalValue"
import * as FiberRef from "effect/FiberRef"

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
    E2 | DiscordRESTError | Http.error.ResponseError,
    DiscordREST | DiscordGateway | Exclude<R2, DiscordInteraction>
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
        rest.getCurrentBotApplicationInformation().json,
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
        rest.createInteractionResponse(i.id, i.token, r).pipe(Effect.scoped),
      )

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        Effect.provideService(postHandler(handle[i.type](i)), Interaction, i),
      )

      const sync = yield* _(FiberRef.get(interactionsSync))

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

const makeRegistry = Effect.gen(function* (_) {
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
        run(Effect.catchAllCause(_ => Effect.logError("unhandled error", _))),
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

export interface InteractionsRegistryService {
  readonly register: <E>(
    ix: InteractionBuilder<never, E, never>,
  ) => Effect.Effect<void>
}
export interface InteractionsRegistry {
  readonly _: unique symbol
}

export const InteractionsRegistry = GenericTag<
  InteractionsRegistry,
  InteractionsRegistryService
>("dfx/Interactions/InteractionsRegistry")
export const InteractionsRegistryLive = Layer.scoped(
  InteractionsRegistry,
  makeRegistry,
)
