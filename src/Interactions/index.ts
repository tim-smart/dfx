import * as D from "./definitions.js"

export {
  global,
  guild,
  messageComponent,
  modalSubmit,
  autocomplete,
  InteractionHandler,
  InteractionDefinition,
} from "./definitions.js"

class InteractionBuilder<R, E> {
  constructor(readonly definitions: D.InteractionDefinition<R, E>[]) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>([
      ...this.definitions,
      definition,
    ])
  }

  get runGateway() {
    return runGateway(this.definitions)
  }
}

export const builder = new InteractionBuilder<never, never>([])

const runGateway = <R, E>(definitions: D.InteractionDefinition<R, E>[]) =>
  Do(($) => {
    const globalCommands = definitions.filter(
      (a): a is D.GlobalApplicationCommand<R, E> =>
        a._tag === "GlobalApplicationCommand",
    )

    const guildCommands = definitions.filter(
      (a): a is D.GuildApplicationCommand<R, E> =>
        a._tag === "GuildApplicationCommand",
    )

    const messageComponents = definitions.filter(
      (a): a is D.MessageComponent<R, E> => a._tag === "MessageComponent",
    )

    const modalSubmits = definitions.filter(
      (a): a is D.ModalSubmit<R, E> => a._tag === "ModalSubmit",
    )

    const autocompletes = definitions.filter(
      (a): a is D.Autocomplete<R, E> => a._tag === "Autocomplete",
    )

    const application = $(
      Rest.rest.getCurrentBotApplicationInformation().flatMap((a) => a.json),
    )

    const globalSync = Rest.rest.bulkOverwriteGlobalApplicationCommands(
      application.id,
      {
        body: JSON.stringify(globalCommands.map((a) => a.command)),
      },
    )

    const guildSync = Gateway.handleDispatch("GUILD_CREATE", (a) =>
      Rest.rest.bulkOverwriteGuildApplicationCommands(
        application.id,
        a.id,
        guildCommands.map((a) => a.command) as any,
      ),
    )

    const allCommands = [...globalCommands, ...guildCommands].reduce(
      (acc, a) => ({
        ...acc,
        [a.command.name]: a,
      }),
      {} as Record<
        string,
        D.GlobalApplicationCommand<R, E> | D.GuildApplicationCommand<R, E>
      >,
    )

    const handle = (i: Discord.Interaction): Effect<R, E, void> => {
      switch (i.type) {
        case Discord.InteractionType.APPLICATION_COMMAND:
          const data = i.data as Discord.ApplicationCommandDatum
          const command = allCommands[data.name]
          return command ? command.handle(i as any) : Effect.unit()

        case Discord.InteractionType.MESSAGE_COMPONENT:
          const mcData = i.data as Discord.MessageComponentDatum
          return messageComponents
            .filter((a) => a.predicate(mcData.custom_id))
            .map((a) => a.handle(i as any)).collectAllParDiscard

        case Discord.InteractionType.MODAL_SUBMIT:
          const msData = i.data as Discord.ModalSubmitDatum
          return modalSubmits
            .filter((a) => a.predicate(msData.custom_id))
            .map((a) => a.handle(i as any)).collectAllParDiscard

        case Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
          const acData = i.data as Discord.ApplicationCommandDatum
          const option = allOptions(acData.options!).find((a) => a.focused)
          if (!option) return Effect.unit()
          return autocompletes
            .filter((a) => a.predicate(option))
            .map((a) => a.handle(i as any)).collectAllParDiscard
      }

      return Effect.unit()
    }

    const run = Gateway.handleDispatch("INTERACTION_CREATE", handle)

    $(run.zipPar(globalSync).zipPar(guildSync))
  })

const allOptions = (
  options: Discord.ApplicationCommandInteractionDataOption[],
): Discord.ApplicationCommandInteractionDataOption[] =>
  options.flatMap((a) => [a, ...(a.options ? allOptions(a.options) : [])])

// Filters
export const id = (query: string) => (customId: string) =>
  Effect.succeed(query === customId)

export const regex = (query: RegExp) => (customId: string) =>
  Effect.succeed(query.test(customId))

export const option =
  (name: string) =>
  (focusedOption: Discord.ApplicationCommandInteractionDataOption) =>
    Effect.succeed(focusedOption.name === name)
