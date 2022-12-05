import * as D from "./definitions.js"

export * from "./context.js"

export {
  global,
  guild,
  messageComponent,
  modalSubmit,
  autocomplete,
  InteractionDefinition,
  InteractionResponse,
} from "./definitions.js"

export {
  makeConfigLayer as makeWebhookConfig,
  makeHandler as makeWebhookHandler,
  MakeConfigOpts as MakeWebhookConfigOpts,
  WebhookConfig,
  WebhookParseError,
  BadWebhookSignature,
} from "./webhook.js"

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

    return Rest.rest
      .getCurrentBotApplicationInformation()
      .flatMap((r) => r.json)
      .flatMap((app) =>
        Rest.rest.bulkOverwriteGlobalApplicationCommands(app.id, {
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

    return Rest.rest.bulkOverwriteGuildApplicationCommands(
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

export const regex = (query: RegExp) => (customId: string) =>
  Effect.succeed(query.test(customId))

export const option =
  (name: string) =>
  (focusedOption: Discord.ApplicationCommandInteractionDataOption) =>
    Effect.succeed(focusedOption.name === name)
