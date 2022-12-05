import * as D from "./definitions.js"

export const splitDefinitions = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
) => {
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

  return {
    globalCommands,
    guildCommands,
    messageComponents,
    modalSubmits,
    autocompletes,
    allCommands,
  }
}
