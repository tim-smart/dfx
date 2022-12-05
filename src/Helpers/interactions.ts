import * as Arr from "@fp-ts/data/ReadonlyArray"

/**
 * Maybe find a sub-command within the interaction options.
 */
export const allSubCommands = (interaction: Discord.ApplicationCommandDatum) =>
  pipe(
    optionsWithNested(interaction),
    Arr.filter(
      (o) => o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND,
    ),
  )

/**
 * Maybe find a sub-command within the interaction options.
 */
export const findSubCommand =
  (name: string) => (interaction: Discord.ApplicationCommandDatum) =>
    pipe(
      optionsWithNested(interaction),
      Arr.findFirst(
        (o) =>
          o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND &&
          o.name === name,
      ),
    )

/**
 * If the sub-command exists return `true`, else `false`.
 */
export const isSubCommand = (name: string) =>
  flow(findSubCommand(name), (o) => o.isSome)

/**
 * Maybe get the options for a sub-command
 */
export const subCommandOptions = (name: string) =>
  flow(findSubCommand(name), (o) => o.flatMapNullable((o) => o.options))

/**
 * A lens for accessing nested options in a interaction.
 */
export const optionsWithNested = (
  data: Pick<Discord.ApplicationCommandDatum, "options">,
): Discord.ApplicationCommandInteractionDataOption[] => {
  const optsFromOption = (
    opt: Discord.ApplicationCommandInteractionDataOption,
  ): Discord.ApplicationCommandInteractionDataOption[] =>
    Maybe.fromNullable(opt.options)
      .map((opts) => [...opts, ...opts.flatMap(optsFromOption)])
      .match(() => [], identity)

  return Maybe.fromNullable(data.options)
    .map((opts) => [...opts, ...opts.flatMap(optsFromOption)])
    .getOrElse(() => [])
}

/**
 * Return the interaction options as a name / value map.
 */
export const transformOptions = (
  options: Discord.ApplicationCommandInteractionDataOption[],
) =>
  options.reduce(
    (map, option) => ({
      ...map,
      [option.name]: option.value,
    }),
    {} as Record<string, string | undefined>,
  )

/**
 * Return the interaction options as a name / value map.
 */
export const optionsMap = flow(optionsWithNested, transformOptions)

/**
 * Try find a matching option from the interaction.
 */
export const getOption = (name: string) =>
  flow(
    optionsWithNested,
    Arr.findFirst((o) => o.name === name),
  )

/**
 * Try find a matching option from the interaction.
 */
export const focusedOption = flow(
  optionsWithNested,
  Arr.findFirst((o) => o.focused === true),
)

/**
 * Try find a matching option value from the interaction.
 */
export const optionValue = (name: string) =>
  flow(getOption(name), (o) => o.flatMapNullable((o) => o.value))

/**
 * Try extract resolved data
 */
export const resolved = (data: Discord.ApplicationCommandDatum) =>
  Maybe.fromNullable(data.resolved)

/**
 * Try find a matching option value from the interaction.
 */
export const resolveOptionValue =
  <T>(
    name: string,
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ) =>
  (a: Discord.ApplicationCommandDatum): Maybe<T> =>
    Do(($) => {
      const id = $(
        getOption(name)(a).flatMapNullable(
          ({ value }) => value as Discord.Snowflake,
        ),
      )
      const data = $(resolved(a))
      return $(Maybe.fromNullable(f(id, data)))
    })

const extractComponents = (c: Discord.Component): Discord.Component[] => {
  if ("components" in c) {
    return [...c.components, ...c.components.flatMap(extractComponents)]
  }

  return []
}

/**
 * A lens for accessing the components in a interaction.
 */
export const components = (
  a: Discord.ModalSubmitDatum,
): Discord.Component[] => [
  ...a.components,
  ...a.components.flatMap(extractComponents),
]

/**
 * A lens for accessing the components in a interaction.
 */
export const componentsWithValue = flow(
  components,
  Arr.filter((c) => "value" in c && c.value !== undefined),
)

/**
 * Return the interaction components as an id / value map.
 */
export const transformComponents = (options: Discord.Component[]) =>
  (options as Discord.TextInput[]).reduce(
    (map, c) => (c.custom_id ? { ...map, [c.custom_id]: c.value } : map),
    {} as Record<string, string | undefined>,
  )

/**
 * Return the interaction components as an id / value map.
 */
export const componentsMap = flow(components, transformComponents)

/**
 * Try find a matching component from the interaction.
 */
export const getComponent = (id: string) =>
  flow(
    components,
    Arr.findFirst((o) => (o as Discord.TextInput).custom_id === id),
  )

/**
 * Try find a matching component value from the interaction.
 */
export const componentValue = (id: string) =>
  flow(getComponent(id), (o) =>
    o.flatMapNullable((o) => (o as Discord.TextInput).value),
  )
