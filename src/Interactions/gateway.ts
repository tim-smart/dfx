import * as Http from "@effect-http/client"
import { DiscordGateway } from "dfx/DiscordGateway"
import { DiscordREST, DiscordRESTError } from "dfx/DiscordREST"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { Interaction, InteractionBuilder, builder } from "./index.js"
import { splitDefinitions } from "./utils.js"

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
      const { GlobalApplicationCommand, GuildApplicationCommand } =
        splitDefinitions(ix.definitions)

      const gateway = $(DiscordGateway)
      const rest = $(DiscordREST)

      const application = $(
        rest.getCurrentBotApplicationInformation().flatMap(a => a.json),
      )

      const globalSync = rest.bulkOverwriteGlobalApplicationCommands(
        application.id,
        {
          body: Http.body.json(
            GlobalApplicationCommand.map(([_]) => _.command),
          ),
        },
      )

      const guildSync = GuildApplicationCommand.length
        ? gateway.handleDispatch("GUILD_CREATE", a =>
            rest.bulkOverwriteGuildApplicationCommands(
              application.id,
              a.id,
              GuildApplicationCommand.map(([_]) => _.command) as any,
            ),
          )
        : Effect.never()

      const handle = handlers(ix.definitions)

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        pipe(
          handle[i.type](i).tap(r =>
            rest.createInteractionResponse(i.id, i.token, r),
          ),
          postHandler,
        ).provideService(Interaction, i),
      )

      return $(sync ? run.zipParRight(globalSync).zipParRight(guildSync) : run)
    })

const makeRegistry = Do($ => {
  const ref = $(Ref.make(builder))

  const register = (ix: InteractionBuilder<never, never>) =>
    ref.update(_ => _.concat(ix))

  const run = ref.get.flatMap(_ =>
    _.runGateway(_ => _.catchAllCause(_ => _.logErrorCause)),
  )

  return { register, run } as const
})

export interface InteractionsRegistry {
  readonly register: (
    ix: InteractionBuilder<never, never>,
  ) => Effect<never, never, void>

  readonly run: Effect<
    DiscordREST | DiscordGateway,
    DiscordRESTError | Http.ResponseDecodeError,
    never
  >
}

export const InteractionsRegistry = Tag<InteractionsRegistry>()
export const InteractionsRegistryLive =
  makeRegistry.toLayer(InteractionsRegistry)
