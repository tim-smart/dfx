import * as D from "./definitions.js"

export const splitDefinitions = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
) => {
  const grouped = definitions.reduce<{
    [K in D.InteractionDefinition<R, E>["_tag"]]: Extract<
      D.InteractionDefinition<R, E>,
      { _tag: K }
    >[]
  }>(
    (acc, a) => ({
      ...acc,
      [a._tag]: [...(acc[a._tag] ?? []), a],
    }),
    {
      Autocomplete: [],
      GlobalApplicationCommand: [],
      GuildApplicationCommand: [],
      MessageComponent: [],
      ModalSubmit: [],
    },
  )

  const Commands = [
    ...grouped.GlobalApplicationCommand,
    ...grouped.GuildApplicationCommand,
  ].reduce(
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
    ...grouped,
    Commands,
  }
}
