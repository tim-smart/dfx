import { identity, pipe } from "@effect/data/Function"
import * as HashMap from "@effect/data/HashMap"
import * as Option from "@effect/data/Option"
import * as Arr from "@effect/data/ReadonlyArray"
import * as Discord from "dfx/types"

/**
 * Option find a sub-command within the interaction options.
 */
export const allSubCommands = (interaction: Discord.ApplicationCommandDatum) =>
  pipe(
    optionsWithNested(interaction),
    Arr.filter(
      o => o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND,
    ),
  )

/**
 * Option find a sub-command within the interaction options.
 */
export const findSubCommand =
  (name: string) => (interaction: Discord.ApplicationCommandDatum) =>
    pipe(
      optionsWithNested(interaction),
      Arr.findFirst(
        o =>
          o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND
          && o.name === name,
      ),
    )

/**
 * If the sub-command exists return `true`, else `false`.
 */
export const isSubCommand =
  (name: string) => (_: Discord.ApplicationCommandDatum) =>
    Option.isSome(findSubCommand(name)(_))

/**
 * Option get the options for a sub-command
 */
export const subCommandOptions =
  (name: string) => (_: Discord.ApplicationCommandDatum) =>
    Option.flatMapNullable(findSubCommand(name)(_), o => o.options)

/**
 * A lens for accessing nested options in a interaction.
 */
export const optionsWithNested = (
  data: Pick<Discord.ApplicationCommandDatum, "options">,
): Array<Discord.ApplicationCommandInteractionDataOption> => {
  const optsFromOption = (
    opt: Discord.ApplicationCommandInteractionDataOption,
  ): Array<Discord.ApplicationCommandInteractionDataOption> =>
    Option.fromNullable(opt.options).pipe(
      Option.map(opts => [...opts, ...opts.flatMap(optsFromOption)]),
      Option.match({ onNone: () => [], onSome: identity }),
    )

  return Option.fromNullable(data.options).pipe(
    Option.map(opts => [...opts, ...opts.flatMap(optsFromOption)]),
    Option.getOrElse(() => []),
  )
}

/**
 * Return the interaction options as a name / value map.
 */
export const transformOptions = (
  options: Array<Discord.ApplicationCommandInteractionDataOption>,
) =>
  options.reduce(
    (map, option) => HashMap.set(map, option.name, option.value),
    HashMap.empty<string, string | undefined>(),
  )

/**
 * Return the interaction options as a name / value map.
 */
export const optionsMap = (
  data: Pick<Discord.ApplicationCommandDatum, "options">,
) => transformOptions(optionsWithNested(data))

/**
 * Try find a matching option from the interaction.
 */
export const getOption =
  (name: string) => (data: Pick<Discord.ApplicationCommandDatum, "options">) =>
    Arr.findFirst(optionsWithNested(data), o => o.name === name)

/**
 * Try find a matching option from the interaction.
 */
export const focusedOption = (
  data: Pick<Discord.ApplicationCommandDatum, "options">,
) => Arr.findFirst(optionsWithNested(data), o => o.focused === true)

/**
 * Try find a matching option value from the interaction.
 */
export const optionValue =
  (name: string) => (data: Pick<Discord.ApplicationCommandDatum, "options">) =>
    Option.flatMapNullable(getOption(name)(data), o => o.value)

/**
 * Try extract resolved data
 */
export const resolved = (data: Discord.Interaction) =>
  Option.flatMapNullable(
    Option.fromNullable(data.data),
    a => (a as Discord.ApplicationCommandDatum).resolved,
  )

/**
 * Try find a matching option value from the interaction.
 */
export const resolveOptionValue = <T>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
) =>
(a: Discord.Interaction): Option.Option<T> =>
  Option.Do.pipe(
    Option.bind("data", () =>
      Option.fromNullable(a.data as Discord.ApplicationCommandDatum)),
    Option.bind("id", ({ data }) =>
      Option.flatMapNullable(
        getOption(name)(data),
        ({ value }) =>
          value as Discord.Snowflake,
      )),
    Option.bind("r", () => resolved(a)),
    Option.flatMapNullable(({ id, r }) => f(id, r)),
  )

/**
 * Try find matching option values from the interaction.
 */
export const resolveValues = <T>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
) =>
(a: Discord.Interaction): Option.Option<ReadonlyArray<T>> =>
  Option.Do.pipe(
    Option.bind("values", () =>
      Option.flatMapNullable(
        Option.fromNullable(a.data as Discord.MessageComponentDatum),
        a => a.values as unknown as Array<string>,
      )),
    Option.bind("r", () => resolved(a)),
    Option.map(({ r, values }) =>
      Arr.compact(values.map(a => Option.fromNullable(f(a as any, r))))
    ),
  )

const extractComponents = (c: Discord.Component): Array<Discord.Component> => {
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
): Array<Discord.Component> => [
  ...a.components,
  ...a.components.flatMap(extractComponents),
]

/**
 * A lens for accessing the components in a interaction.
 */
export const componentsWithValue = (data: Discord.ModalSubmitDatum) =>
  Arr.filter(components(data), c => "value" in c && c.value !== undefined)

/**
 * Return the interaction components as an id / value map.
 */
export const transformComponents = (options: Array<Discord.Component>) =>
  (options as Array<Discord.TextInput>).reduce(
    (map, c) => (c.custom_id ? HashMap.set(map, c.custom_id, c.value) : map),
    HashMap.empty<string, string | undefined>(),
  )

/**
 * Return the interaction components as an id / value map.
 */
export const componentsMap = (data: Discord.ModalSubmitDatum) =>
  transformComponents(components(data))

/**
 * Try find a matching component from the interaction.
 */
export const getComponent = (id: string) => (data: Discord.ModalSubmitDatum) =>
  Arr.findFirst(
    components(data),
    o => (o as Discord.TextInput).custom_id === id,
  )

/**
 * Try find a matching component value from the interaction.
 */
export const componentValue =
  (id: string) => (data: Discord.ModalSubmitDatum) =>
    Option.flatMapNullable(
      getComponent(id)(data),
      o => (o as Discord.TextInput).value,
    )

export type InteractionResponse =
  | {
    type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE
    data: Discord.InteractionCallbackMessage
  }
  | {
    type: Discord.InteractionCallbackType.UPDATE_MESSAGE
    data: Discord.InteractionCallbackMessage
  }
  | {
    type: Discord.InteractionCallbackType.MODAL
    data: Discord.InteractionCallbackModal
  }
  | {
    type: Discord.InteractionCallbackType.DEFERRED_UPDATE_MESSAGE
  }
  | {
    type: Discord.InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  }
  | {
    type:
      Discord.InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
    data: Discord.InteractionCallbackAutocomplete
  }

export const response = (r: InteractionResponse) => r
