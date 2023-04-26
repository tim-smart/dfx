import { DiscordREST } from "dfx"
import { Discord, Effect } from "dfx/_common"
import * as D from "./definitions.js"
import * as Http from "@effect-http/client"

export { response } from "../Helpers/interactions.js"
export * as helpers from "../Helpers/interactions.js"
export * from "./context.js"
export {
  autocomplete,
  global,
  guild,
  InteractionDefinition,
  messageComponent,
  modalSubmit,
} from "./definitions.js"

/**
 * @tsplus type dfx/InteractionBuilder
 */
export class InteractionBuilder<R, E> {
  constructor(readonly definitions: D.InteractionDefinition<R, E>[]) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>([
      ...this.definitions,
      definition,
    ])
  }

  concat<R1, E1>(builder: InteractionBuilder<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>([
      ...this.definitions,
      ...builder.definitions,
    ])
  }

  get syncGlobal() {
    const commands = this.definitions
      .filter(
        (c): c is D.GlobalApplicationCommand<R, E> =>
          c._tag === "GlobalApplicationCommand",
      )
      .map(c => c.command)

    return DiscordREST.flatMap(rest =>
      rest
        .getCurrentBotApplicationInformation()
        .flatMap(r => r.json)
        .flatMap(app =>
          rest.bulkOverwriteGlobalApplicationCommands(app.id, {
            body: Http.body.json(commands),
          }),
        ),
    )
  }

  syncGuild(appId: Discord.Snowflake, guildId: Discord.Snowflake) {
    const commands = this.definitions
      .filter(
        (c): c is D.GuildApplicationCommand<R, E> =>
          c._tag === "GuildApplicationCommand",
      )
      .map(c => c.command)

    return DiscordREST.flatMap(rest =>
      rest.bulkOverwriteGuildApplicationCommands(
        appId,
        guildId,
        commands as any,
      ),
    )
  }
}

export const builder = new InteractionBuilder<never, never>([])

// Filters
export const id = (query: string) => (customId: string) =>
  Effect.succeed(query === customId)

export const idStartsWith = (query: string) => (customId: string) =>
  Effect.succeed(customId.startsWith(query))

export const idRegex = (query: RegExp) => (customId: string) =>
  Effect.succeed(query.test(customId))

export const option =
  (command: string, optionName: string) =>
  (
    data: Pick<Discord.ApplicationCommandDatum, "name">,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(data.name === command && focusedOption.name === optionName)

export const optionOnly =
  (optionName: string) =>
  (
    _: unknown,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(focusedOption.name === optionName)
