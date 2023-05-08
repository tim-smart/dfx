import * as Http from "@effect-http/client"
import { DiscordGateway } from "dfx/DiscordGateway"
import { DiscordREST, DiscordRESTError } from "dfx/DiscordREST"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { Interaction, InteractionBuilder, builder } from "./index.js"
import type {
  GlobalApplicationCommand,
  GuildApplicationCommand,
} from "./definitions.js"

export interface RunOpts {
  sync?: boolean
}

/**
 * @tsplus pipeable dfx/InteractionBuilder runGateway
 */
export const run =
  <R, R2, E, TE, E2>(
    postHandler: (
      effect: Effect<
        R | DiscordREST | Discord.Interaction,
        TE | DiscordRESTError | DefinitionNotFound,
        void
      >,
    ) => Effect<R2, E2, void>,
    { sync = true }: RunOpts = {},
  ) =>
  (
    ix: InteractionBuilder<R, E, TE>,
  ): Effect<
    DiscordREST | DiscordGateway | Exclude<R2, Discord.Interaction>,
    E2 | DiscordRESTError | Http.ResponseDecodeError,
    never
  > =>
    Do($ => {
      const GlobalApplicationCommand = ix.definitions
        .map(_ => _[0])
        .filter(
          (_): _ is GlobalApplicationCommand<R, E> =>
            _._tag === "GlobalApplicationCommand",
        ).toReadonlyArray
      const GuildApplicationCommand = ix.definitions
        .map(_ => _[0])
        .filter(
          (_): _ is GuildApplicationCommand<R, E> =>
            _._tag === "GuildApplicationCommand",
        ).toReadonlyArray

      const gateway = $(DiscordGateway)
      const rest = $(DiscordREST)

      const application = $(
        rest.getCurrentBotApplicationInformation().flatMap(a => a.json),
      )

      const globalSync = rest.bulkOverwriteGlobalApplicationCommands(
        application.id,
        {
          body: Http.body.json(GlobalApplicationCommand.map(_ => _.command)),
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
        : Effect.never()

      const handle = handlers(ix.definitions, (i, r) =>
        rest.createInteractionResponse(i.id, i.token, r),
      )

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        postHandler(handle[i.type](i)).provideService(Interaction, i),
      )

      return $(sync ? run.zipParRight(globalSync).zipParRight(guildSync) : run)
    })

const makeRegistry = Do($ => {
  const ref = $(Ref.make(builder))
  const queue = $(Queue.unbounded<InteractionBuilder<never, never, never>>())

  const register = <E>(ix: InteractionBuilder<never, E, never>) =>
    ref.updateAndGet(_ => _.concat(ix as any)).flatMap(_ => queue.offer(_))

  const run = <R, E>(
    onError: (
      _: Cause<DiscordRESTError | DefinitionNotFound>,
    ) => Effect<R, E, void>,
    opts?: RunOpts,
  ) =>
    queue
      .take()
      .foreverSwitch(_ => _.runGateway(_ => _.catchAllCause(onError), opts))

  return { register, run } as const
})

export interface InteractionsRegistry {
  readonly register: <E>(
    ix: InteractionBuilder<never, E, never>,
  ) => Effect<never, never, void>

  readonly run: <R, E>(
    onError: (
      _: Cause<DiscordRESTError | DefinitionNotFound>,
    ) => Effect<R, E, void>,
    opts?: RunOpts,
  ) => Effect<
    DiscordREST | DiscordGateway | Exclude<R, Discord.Interaction>,
    DiscordRESTError | Http.ResponseDecodeError | E,
    never
  >
}

export const InteractionsRegistry = Tag<InteractionsRegistry>()
export const InteractionsRegistryLive =
  makeRegistry.toLayer(InteractionsRegistry)
