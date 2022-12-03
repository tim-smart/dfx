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

export const builder = () => new InteractionBuilder<never>([])

class InteractionBuilder<R> {
  constructor(readonly definitions: D.InteractionDefinition<R>[]) {}

  add<R1>(definition: D.InteractionDefinition<R1>) {
    return new InteractionBuilder<R | R1>([...this.definitions, definition])
  }

  get run() {
    return runGateway(this.definitions)
  }
}

const runGateway = <R>(definitions: D.InteractionDefinition<R>[]) =>
  Do(($) => {
    const globalCommands = definitions.filter(
      (a): a is D.GlobalApplicationCommand<R> =>
        a._tag === "GlobalApplicationCommand",
    )

    const guildCommands = definitions.filter(
      (a): a is D.GuildApplicationCommand<R> =>
        a._tag === "GuildApplicationCommand",
    )

    const messageComponents = definitions.filter(
      (a): a is D.MessageComponent<R> => a._tag === "MessageComponent",
    )

    const modalSubmits = definitions.filter(
      (a): a is D.ModalSubmit<R> => a._tag === "ModalSubmit",
    )

    const autocompletes = definitions.filter(
      (a): a is D.Autocomplete<R> => a._tag === "Autocomplete",
    )

    const application = $(
      Rest.rest.getCurrentBotApplicationInformation().flatMap((a) => a.json),
    )

    $(
      Rest.rest.bulkOverwriteGlobalApplicationCommands(application.id, {
        body: JSON.stringify(globalCommands.map((a) => a.command)),
      }),
    )

    const gateway = $(Effect.service(Gateway.DiscordGateway))

    const allCommands = [...globalCommands, ...guildCommands].reduce(
      (acc, a) => ({
        ...acc,
        [a.command.name]: a,
      }),
      {} as Record<
        string,
        D.GlobalApplicationCommand<R> | D.GuildApplicationCommand<R>
      >,
    )

    const handle = (i: Discord.Interaction): Effect<R, never, void> => {
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

    const run = gateway
      .fromDispatch("INTERACTION_CREATE")
      .chainPar((i) => EffectSource.fromEffect(handle(i))).runDrain

    $(run)
  })

const allOptions = (
  options: Discord.ApplicationCommandInteractionDataOption[],
): Discord.ApplicationCommandInteractionDataOption[] =>
  options.flatMap((a) => [a, ...(a.options ? allOptions(a.options) : [])])
