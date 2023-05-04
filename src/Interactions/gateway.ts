import * as Http from "@effect-http/client"
import { DiscordGateway } from "dfx/DiscordGateway"
import { DiscordREST, DiscordRESTError } from "dfx/DiscordREST"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { Interaction, InteractionBuilder } from "./index.js"
import { splitDefinitions } from "./utils.js"

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
  (
    ix: InteractionBuilder<R, E>,
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
        : Effect.never()

      const handle = handlers(ix.definitions)

      const run = gateway.handleDispatch("INTERACTION_CREATE", i =>
        pipe(
          ix
            .transformRespond(handle[i.type](i))
            .tap(r => rest.createInteractionResponse(i.id, i.token, r)),
          ix.transform,
          postHandler,
        ).provideService(Interaction, i),
      )

      return $(sync ? run.zipParRight(globalSync).zipParRight(guildSync) : run)
    })
