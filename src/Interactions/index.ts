import * as D from "./definitions.js"

export * from "./context.js"

export {
  global,
  guild,
  messageComponent,
  modalSubmit,
  autocomplete,
  InteractionDefinition,
} from "./definitions.js"

export { response as r } from "../Helpers/interactions.js"

export class InteractionBuilder<R, E> {
  constructor(readonly definitions: D.InteractionDefinition<R, E>[]) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>([
      ...this.definitions,
      definition,
    ])
  }

  get syncGlobal() {
    const commands = this.definitions
      .filter(
        (c): c is D.GlobalApplicationCommand<R, E> =>
          c._tag === "GlobalApplicationCommand",
      )
      .map((c) => c.command)

    return rest
      .getCurrentBotApplicationInformation()
      .flatMap((r) => r.json)
      .flatMap((app) =>
        rest.bulkOverwriteGlobalApplicationCommands(app.id, {
          body: JSON.stringify(commands),
        }),
      )
  }

  syncGuild(appId: Discord.Snowflake, guildId: Discord.Snowflake) {
    const commands = this.definitions
      .filter(
        (c): c is D.GuildApplicationCommand<R, E> =>
          c._tag === "GuildApplicationCommand",
      )
      .map((c) => c.command)

    return rest.bulkOverwriteGuildApplicationCommands(
      appId,
      guildId,
      commands as any,
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
