import { GenericTag } from "effect/Context"
import type * as HashMap from "effect/HashMap"
import * as Option from "effect/Option"
import * as Arr from "effect/ReadonlyArray"
import * as Effect from "effect/Effect"
import * as IxHelpers from "dfx/Helpers/interactions"
import type * as Discord from "dfx/types"

export interface DiscordInteraction {
  readonly _: unique symbol
}
export const Interaction = GenericTag<DiscordInteraction, Discord.Interaction>(
  "dfx/Interactions/Interaction",
)

export interface DiscordApplicationCommand {
  readonly _: unique symbol
}
export const ApplicationCommand = GenericTag<
  DiscordApplicationCommand,
  Discord.ApplicationCommandDatum
>("dfx/Interactions/ApplicationCommand")

export interface DiscordMessageComponent {
  readonly _: unique symbol
}
export const MessageComponentData = GenericTag<
  DiscordMessageComponent,
  Discord.MessageComponentDatum
>("dfx/Interactions/MessageComponentData")

export interface DiscordModalSubmit {
  readonly _: unique symbol
}
export const ModalSubmitData = GenericTag<
  DiscordModalSubmit,
  Discord.ModalSubmitDatum
>("dfx/Interactions/ModalSubmitData")

export interface DiscordFocusedOption {
  readonly _: unique symbol
}
export interface FocusedOptionContext {
  readonly focusedOption: Discord.ApplicationCommandInteractionDataOption
}
export const FocusedOptionContext = GenericTag<
  DiscordFocusedOption,
  FocusedOptionContext
>("dfx/Interactions/FocusedOptionContext")

export interface DiscordSubCommand {
  readonly _: unique symbol
}
export interface SubCommandContext {
  readonly command: Discord.ApplicationCommandInteractionDataOption
}
export const SubCommandContext = GenericTag<
  DiscordSubCommand,
  SubCommandContext
>("dfx/Interactions/SubCommandContext")

export class ResolvedDataNotFound {
  readonly _tag = "ResolvedDataNotFound"
  constructor(
    readonly data: Discord.Interaction,
    readonly name?: string,
  ) {}
}

export const resolvedValues = <A>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<ReadonlyArray<A>, ResolvedDataNotFound, DiscordInteraction> =>
  Effect.flatMap(Interaction, ix =>
    Effect.mapError(
      IxHelpers.resolveValues(f)(ix),
      () => new ResolvedDataNotFound(ix),
    ),
  )

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<A, ResolvedDataNotFound, DiscordInteraction> =>
  Effect.flatMap(Interaction, ix =>
    Effect.mapError(
      IxHelpers.resolveOptionValue(name, f)(ix),
      () => new ResolvedDataNotFound(ix, name),
    ),
  )

export const focusedOptionValue = Effect.map(
  FocusedOptionContext,
  _ => _.focusedOption.value ?? "",
)

export class SubCommandNotFound {
  readonly _tag = "SubCommandNotFound"
  constructor(readonly data: Discord.ApplicationCommandDatum) {}
}

export const handleSubCommands = <
  NER extends Record<
    string,
    Effect.Effect<Discord.InteractionResponse, any, any>
  >,
>(
  commands: NER,
): Effect.Effect<
  Discord.InteractionResponse,
  | ([NER[keyof NER]] extends [
      { [Effect.EffectTypeId]: { _E: (_: never) => infer E } },
    ]
      ? E
      : never)
  | SubCommandNotFound,
  | Exclude<
      [NER[keyof NER]] extends [
        { [Effect.EffectTypeId]: { _R: (_: never) => infer R } },
      ]
        ? R
        : never,
      SubCommandContext
    >
  | Discord.Interaction
  | Discord.ApplicationCommandDatum
> =>
  ApplicationCommand.pipe(
    Effect.flatMap(data =>
      Effect.mapError(
        Arr.findFirst(IxHelpers.allSubCommands(data), _ => !!commands[_.name]),
        () => new SubCommandNotFound(data),
      ),
    ),
    Effect.flatMap(command =>
      Effect.provideService(commands[command.name], SubCommandContext, {
        command,
      }),
    ),
  )

export const currentSubCommand: Effect.Effect<
  Discord.ApplicationCommandInteractionDataOption,
  never,
  DiscordSubCommand
> = Effect.map(SubCommandContext, _ => _.command)

export const optionsMap: Effect.Effect<
  HashMap.HashMap<string, string | undefined>,
  never,
  DiscordApplicationCommand
> = Effect.map(ApplicationCommand, IxHelpers.optionsMap)

export class RequiredOptionNotFound {
  readonly _tag = "RequiredOptionNotFound"
  constructor(
    readonly data:
      | Discord.ApplicationCommandDatum
      | Discord.ApplicationCommandInteractionDataOption,
    readonly name: string,
  ) {}
}

export const option = (name: string) =>
  Effect.map(ApplicationCommand, IxHelpers.getOption(name))

export const optionValue = (name: string) =>
  Effect.flatMap(option(name), _ =>
    Option.match(
      Option.flatMapNullable(_, a => a.value),
      {
        onNone: () =>
          Effect.flatMap(ApplicationCommand, data =>
            Effect.fail(new RequiredOptionNotFound(data, name)),
          ),
        onSome: Effect.succeed,
      },
    ),
  )

export const optionValueOptional = (name: string) =>
  Effect.map(
    option(name),
    Option.flatMapNullable(o => o.value),
  )

export const modalValues = Effect.map(ModalSubmitData, IxHelpers.componentsMap)

export const modalValueOption = (name: string) =>
  Effect.map(ModalSubmitData, IxHelpers.componentValue(name))

export class ModalValueNotFound {
  readonly _tag = "ModalValueNotFound"
  constructor(
    readonly data: Discord.ModalSubmitDatum,
    readonly name: string,
  ) {}
}

export const modalValue = (name: string) =>
  Effect.flatMap(ModalSubmitData, data =>
    Effect.mapError(
      IxHelpers.componentValue(name)(data),
      () => new ModalValueNotFound(data, name),
    ),
  )
