import * as Http from "@effect-http/client"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { InteractionBuilder, InteractionContext } from "./index.js"
import { splitDefinitions } from "./utils.js"
import { DiscordREST, DiscordRESTError } from "dfx/DiscordREST"
import { DiscordGateway } from "dfx/DiscordGateway"

export interface RunOpts {
  sync?: boolean
}

/**
 * @tsplus pipeable dfx/InteractionBuilder runGateway
 */
export const run =
  <R, R2, E, E2>(
    postHandler: (
      effect: Effect<
        R | DiscordREST | Discord.Interaction,
        E | DiscordRESTError | DefinitionNotFound,
        void
      >,
    ) => Effect<R2, E2, void>,
    { sync = true }: RunOpts = {},
  ) =>
  (ix: InteractionBuilder<R, E>) =>
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
        { body: Http.body.json(GlobalApplicationCommand.map(a => a.command)) },
      )

      const guildSync = GuildApplicationCommand.length
        ? gateway.handleDispatch("GUILD_CREATE", a =>
            rest.bulkOverwriteGuildApplicationCommands(
              application.id,
              a.id,
              GuildApplicationCommand.map(a => a.command) as any,
            ),
          )
        : Effect.unit()

      const handle = handlers(ix.definitions)

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        pipe(
          handle[i.type](i).tap(r =>
            rest.createInteractionResponse(i.id, i.token, r),
          ),
          postHandler,
        ).provideService(InteractionContext, i),
      )

      $(sync ? Effect.allPar(run, globalSync, guildSync) : run)
    })
