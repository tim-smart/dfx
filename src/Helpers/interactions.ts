import * as Discord from "dfx/types"
import * as Arr from "effect/Array"
import { identity, pipe } from "effect/Function"
import * as HashMap from "effect/HashMap"
import * as Option from "effect/Option"

/**
 * Option find a sub-command within the interaction options.
 */
export const allSubCommands = (
  interaction: Discord.APIApplicationCommandInteraction["data"],
) =>
  pipe(
    optionsWithNested(interaction as any),
    Arr.filter(
      o => o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND,
    ),
  )

/**
 * Get the target for the application command data.
 */
export const target = (
  interaction: Discord.APIApplicationCommandInteraction["data"],
):
  | Discord.APIApplicationCommandInteraction["data"]
  | Discord.UserResponse
  | Discord.MessageResponse => targetTypes[interaction.type](interaction)

const targetTypes: Record<
  Discord.ApplicationCommandType,
  (
    data: any,
  ) =>
    | Discord.UserResponse
    | Discord.MessageResponse
    | Discord.APIApplicationCommandInteraction["data"]
> = {
  [Discord.ApplicationCommandType.USER]: data =>
    data.resolved.users![(data as any).target_id] as Discord.UserResponse,
  [Discord.ApplicationCommandType.MESSAGE]: data =>
    data.resolved.messages![data.target_id],
  [Discord.ApplicationCommandType.CHAT]: data => data,
  [Discord.ApplicationCommandType.PRIMARY_ENTRY_POINT]: data => data,
}

/**
 * Option find a sub-command within the interaction options.
 */
export const findSubCommand =
  (name: string) =>
  (interaction: Discord.APIApplicationCommandInteraction["data"]) =>
    pipe(
      optionsWithNested(interaction as any),
      Arr.findFirst(
        (
          o,
        ): o is Discord.APIApplicationCommandInteractionDataSubcommandOption =>
          o.type === Discord.ApplicationCommandOptionType.SUB_COMMAND &&
          o.name === name,
      ),
    )

/**
 * If the sub-command exists return `true`, else `false`.
 */
export const isSubCommand =
  (name: string) => (_: Discord.APIApplicationCommandInteraction["data"]) =>
    Option.isSome(findSubCommand(name)(_))

/**
 * Option get the options for a sub-command
 */
export const subCommandOptions =
  (name: string) => (_: Discord.APIApplicationCommandInteraction["data"]) =>
    Option.flatMapNullable(findSubCommand(name)(_), o => o.options)

/**
 * A lens for accessing nested options in a interaction.
 */
export const optionsWithNested = (data: {
  readonly options?:
    | ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
    | undefined
}): Array<Discord.APIApplicationCommandInteractionDataOption> => {
  const optsFromOption = (opt: {
    readonly options?: ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
  }): Array<Discord.APIApplicationCommandInteractionDataOption> =>
    Option.fromNullable(opt.options).pipe(
      Option.map(opts => [
        ...opts,
        ...opts.flatMap(_ => optsFromOption(_ as any)),
      ]),
      Option.match({ onNone: () => [], onSome: identity }),
    )

  return Option.fromNullable(data.options).pipe(
    Option.map(opts => [
      ...opts,
      ...opts.flatMap(_ => optsFromOption(_ as any)),
    ]),
    Option.getOrElse(() => []),
  )
}

/**
 * Return the interaction options as a name / value map.
 */
export const transformOptions = (
  options: Array<Discord.APIApplicationCommandInteractionDataOption>,
) =>
  options.reduce(
    (map, option) => HashMap.set(map, option.name, (option as any).value),
    HashMap.empty<string, string | number | boolean | undefined>(),
  )

/**
 * Return the interaction options as a name / value map.
 */
export const optionsMap = (data: {
  readonly options?:
    | ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
    | undefined
}) => transformOptions(optionsWithNested(data))

/**
 * Try find a matching option from the interaction.
 */
export const getOption =
  (name: string) =>
  (data: {
    readonly options?:
      | ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
      | undefined
  }) =>
    Arr.findFirst(optionsWithNested(data), o => o.name === name)

/**
 * Try find a matching option from the interaction.
 */
export const focusedOption = (data: {
  readonly options?:
    | ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
    | undefined
}) =>
  Arr.findFirst(
    optionsWithNested(data),
    o => "focused" in o && o.focused === true,
  )

/**
 * Try find a matching option value from the interaction.
 */
export const optionValue =
  (name: string) =>
  (data: {
    readonly options?:
      | ReadonlyArray<Discord.APIApplicationCommandInteractionDataOption>
      | undefined
  }) =>
    Option.flatMapNullable(getOption(name)(data), o =>
      "value" in o ? o.value : undefined,
    )

/**
 * Try extract resolved data
 */
export const resolved = (data: Discord.APIInteraction) =>
  Option.flatMapNullable(Option.fromNullable(data.data), a =>
    "resolved" in a
      ? (a.resolved as Discord.InteractionDataResolved)
      : undefined,
  )

/**
 * Try find a matching option value from the interaction.
 */
export const resolveOptionValue =
  <T>(
    name: string,
    f: (
      id: Discord.Snowflake,
      data: Discord.InteractionDataResolved,
    ) => T | undefined,
  ) =>
  (a: Discord.APIInteraction): Option.Option<T> =>
    Option.Do.pipe(
      Option.bind("data", () => Option.fromNullable(a.data as any)),
      Option.bind("id", ({ data }) =>
        Option.flatMapNullable(
          getOption(name)(data) as Option.Option<{ value: Discord.Snowflake }>,
          ({ value }) => value,
        ),
      ),
      Option.bind("r", () => resolved(a)),
      Option.flatMapNullable(({ id, r }) => f(id, r)),
    )

/**
 * Try find matching option values from the interaction.
 */
export const resolveValues =
  <T>(
    f: (
      id: Discord.Snowflake,
      data: Discord.InteractionDataResolved,
    ) => T | undefined,
  ) =>
  (a: Discord.APIInteraction): Option.Option<ReadonlyArray<T>> =>
    Option.Do.pipe(
      Option.bind("values", () =>
        Option.flatMapNullable(
          Option.fromNullable(a.data as any),
          a => a.values as unknown as Array<string>,
        ),
      ),
      Option.bind("r", () => resolved(a)),
      Option.map(({ r, values }) =>
        Arr.getSomes(values.map(a => Option.fromNullable(f(a as any, r)))),
      ),
    )

const extractComponents = (
  c: Discord.AllComponents,
): Array<Discord.AllComponents> => {
  if ("components" in c) {
    return [...c.components!, ...c.components!.flatMap(extractComponents)]
  }

  return []
}

/**
 * A lens for accessing the components in a interaction.
 */
export const components = (
  a: Discord.APIModalSubmission,
): Array<Discord.AllComponents> => [
  ...(a.components as any),
  ...a.components.flatMap(extractComponents as any),
]

/**
 * A lens for accessing the components in a interaction.
 */
export const componentsWithValue = (data: Discord.APIModalSubmission) =>
  Arr.filter(components(data), c => "value" in c && c.value !== undefined)

/**
 * Return the interaction components as an id / value map.
 */
export const transformComponents = (options: Array<Discord.AllComponents>) =>
  (options as Array<Discord.TextInputComponentResponse>).reduce(
    (map, c) => (c.custom_id ? HashMap.set(map, c.custom_id, c.value) : map),
    HashMap.empty<string, string | undefined | null>(),
  )

/**
 * Return the interaction components as an id / value map.
 */
export const componentsMap = (data: Discord.APIModalSubmission) =>
  transformComponents(components(data))

/**
 * Try find a matching component from the interaction.
 */
export const getComponent =
  (id: string) => (data: Discord.APIModalSubmission) =>
    Arr.findFirst(
      components(data),
      o => (o as Discord.TextInputComponentResponse).custom_id === id,
    )

/**
 * Try find a matching component value from the interaction.
 */
export const componentValue =
  (id: string) => (data: Discord.APIModalSubmission) =>
    Option.flatMapNullable(
      getComponent(id)(data),
      o => (o as Discord.TextInputComponentResponse).value,
    )

export type InteractionResponse =
  | {
      type: typeof Discord.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE
      data: Discord.IncomingWebhookInteractionRequest
      files?: ReadonlyArray<File>
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.UPDATE_MESSAGE
      data: Discord.IncomingWebhookUpdateForInteractionCallbackRequestPartial
      files?: ReadonlyArray<File>
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.MODAL
      data: Discord.ModalInteractionCallbackRequestData
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
      data: Discord.ApplicationCommandAutocompleteCallbackRequest["data"]
    }
  | {
      type: typeof Discord.InteractionCallbackTypes.LAUNCH_ACTIVITY
    }

export const response = (
  r: InteractionResponse,
): Discord.CreateInteractionResponseRequest => r
