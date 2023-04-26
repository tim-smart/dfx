import * as Arr from "@effect/data/ReadonlyArray"
import { Effect, EffectTypeId } from "@effect/io/Effect"
import * as IxHelpers from "dfx/Helpers/interactions"
import { ModalSubmitDatum } from "dfx/types"

export const Interaction = Tag<Discord.Interaction>()
export const ApplicationCommand = Tag<Discord.ApplicationCommandDatum>()
export const MessageComponentData = Tag<Discord.MessageComponentDatum>()
export const ModalSubmitData = Tag<Discord.ModalSubmitDatum>()

export interface FocusedOptionContext {
  readonly focusedOption: Discord.ApplicationCommandInteractionDataOption
}
export const FocusedOptionContext = Tag<FocusedOptionContext>()

export interface SubCommandContext {
  readonly command: Discord.ApplicationCommandInteractionDataOption
}
export const SubCommandContext = Tag<SubCommandContext>()

export class ResolvedDataNotFound {
  readonly _tag = "ResolvedDataNotFound"
  constructor(readonly data: Discord.Interaction, readonly name?: string) {}
}

export const resolvedValues = <A>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  Interaction.flatMap(ix =>
    IxHelpers.resolveValues(f)(ix).mapError(() => new ResolvedDataNotFound(ix)),
  )

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  Interaction.flatMap(ix =>
    IxHelpers.resolveOptionValue(
      name,
      f,
    )(ix).mapError(() => new ResolvedDataNotFound(ix, name)),
  )

export const focusedOptionValue = FocusedOptionContext.map(
  _ => _.focusedOption.value ?? "",
)

export class SubCommandNotFound {
  readonly _tag = "SubCommandNotFound"
  constructor(readonly data: Discord.ApplicationCommandDatum) {}
}

export const handleSubCommands = <
  NER extends Record<string, Effect<any, any, Discord.InteractionResponse>>,
>(
  commands: NER,
): Effect<
  | Exclude<
      [NER[keyof NER]] extends [
        { [EffectTypeId]: { _R: (_: never) => infer R } },
      ]
        ? R
        : never,
      SubCommandContext
    >
  | Discord.Interaction
  | Discord.ApplicationCommandDatum,
  | ([NER[keyof NER]] extends [
      { [EffectTypeId]: { _E: (_: never) => infer E } },
    ]
      ? E
      : never)
  | SubCommandNotFound,
  Discord.InteractionResponse
> =>
  ApplicationCommand.flatMap(data =>
    Arr.findFirst(IxHelpers.allSubCommands(data), _ => !!commands[_.name])
      .mapError(() => new SubCommandNotFound(data))
      .flatMap(command =>
        commands[command.name].provideService(SubCommandContext, {
          command,
        }),
      ),
  )

export const currentSubCommand = SubCommandContext.map(_ => _.command)

export const optionsMap = ApplicationCommand.map(IxHelpers.optionsMap)

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
  ApplicationCommand.map(IxHelpers.getOption(name))

export const optionValue = (name: string) =>
  option(name).flatMap(_ =>
    _.flatMapNullable(a => a.value).match(
      () =>
        ApplicationCommand.flatMap(data =>
          Effect.fail(new RequiredOptionNotFound(data, name)),
        ),
      Effect.succeed,
    ),
  )

export const optionValueOptional = (name: string) =>
  option(name).map(o => o.flatMapNullable(o => o.value))

export const modalValues = ModalSubmitData.map(IxHelpers.componentsMap)

export const modalValueOption = (name: string) =>
  ModalSubmitData.map(IxHelpers.componentValue(name))

export class ModalValueNotFound {
  readonly _tag = "ModalValueNotFound"
  constructor(readonly data: ModalSubmitDatum, readonly name: string) {}
}

export const modalValue = (name: string) =>
  ModalSubmitData.flatMap(data =>
    IxHelpers.componentValue(name)(data).mapError(
      () => new ModalValueNotFound(data, name),
    ),
  )
