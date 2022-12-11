import { DefinitionNotFound, handlers } from "./handlers.js"
import { InteractionBuilder, InteractionContext } from "./index.js"
import { splitDefinitions } from "./utils.js"

export interface RunOpts {
  sync?: boolean
}

export const run =
  <R, R2, E, E2>(
    postHandler: (
      effect: Effect<
        R | DiscordREST | Discord.Interaction,
        E | FetchError | StatusCodeError | JsonParseError | DefinitionNotFound,
        void
      >,
    ) => Effect<R2, E2, void>,
    { sync = true }: RunOpts = {},
  ) =>
  (ix: InteractionBuilder<R, E>) =>
    Do(($) => {
      const { GlobalApplicationCommand, GuildApplicationCommand } =
        splitDefinitions(ix.definitions)

      const gateway = $(Effect.service(Gateway.DiscordGateway))
      const rest = $(Effect.service(DiscordREST))

      const application = $(
        rest.getCurrentBotApplicationInformation().flatMap((a) => a.json),
      )

      const globalSync = rest.bulkOverwriteGlobalApplicationCommands(
        application.id,
        {
          body: JSON.stringify(GlobalApplicationCommand.map((a) => a.command)),
        },
      )

      const guildSync = GuildApplicationCommand.length
        ? gateway.handleDispatch("GUILD_CREATE", (a) =>
            rest.bulkOverwriteGuildApplicationCommands(
              application.id,
              a.id,
              GuildApplicationCommand.map((a) => a.command) as any,
            ),
          )
        : Effect.unit()

      const handle = handlers(ix.definitions)

      const run = gateway.handleDispatch("INTERACTION_CREATE", (i) =>
        pipe(
          handle[i.type](i).tap((r) =>
            rest.createInteractionResponse(i.id, i.token, r),
          ),
          postHandler,
          Effect.provideService(InteractionContext)(i),
        ),
      )

      $(sync ? run.zipPar(globalSync).zipPar(guildSync) : run)
    })
