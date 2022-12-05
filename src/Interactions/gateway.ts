import * as D from "./definitions.js"
import { handlers } from "./handlers.js"
import { splitDefinitions } from "./utils.js"

export interface RunOpts {
  sync?: boolean
}

export const run = <R, R2, E, E2>(
  definitions: D.InteractionDefinition<R, E>[],
  catchAll: (
    e: Http.FetchError | Http.StatusCodeError | Http.JsonParseError | E,
  ) => Effect<R2, E2, any>,
  { sync = true }: RunOpts = {},
) =>
  Do(($) => {
    const { GlobalApplicationCommand, GuildApplicationCommand } =
      splitDefinitions(definitions)

    const application = $(
      Rest.rest.getCurrentBotApplicationInformation().flatMap((a) => a.json),
    )

    const globalSync = Rest.rest.bulkOverwriteGlobalApplicationCommands(
      application.id,
      {
        body: JSON.stringify(GlobalApplicationCommand.map((a) => a.command)),
      },
    )

    const guildSync = GuildApplicationCommand.length
      ? Gateway.handleDispatch("GUILD_CREATE", (a) =>
          Rest.rest.bulkOverwriteGuildApplicationCommands(
            application.id,
            a.id,
            GuildApplicationCommand.map((a) => a.command) as any,
          ),
        )
      : Effect.unit()

    const handle = handlers(definitions)

    const run = Gateway.handleDispatch("INTERACTION_CREATE", (i) =>
      handle[i.type](i)
        .tap((r) =>
          r.match(Effect.unit, (r) =>
            Rest.rest.createInteractionResponse(i.id, i.token, r),
          ),
        )
        .catchAll(catchAll),
    )

    $(sync ? run.zipPar(globalSync).zipPar(guildSync) : run)
  })
