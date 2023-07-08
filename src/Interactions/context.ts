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
  Interaction.accessWithEffect(ix =>
    IxHelpers.resolveValues(f)(ix).mapError(() => new ResolvedDataNotFound(ix)),
  )

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  Interaction.accessWithEffect(ix =>
    IxHelpers.resolveOptionValue(
      name,
      f,
    )(ix).mapError(() => new ResolvedDataNotFound(ix, name)),
  )

export const focusedOptionValue = FocusedOptionContext.accessWith(
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
  ApplicationCommand.accessWithEffect(data =>
    Arr.findFirst(IxHelpers.allSubCommands(data), _ => !!commands[_.name])
      .mapError(() => new SubCommandNotFound(data))
      .flatMap(command =>
        commands[command.name].provideService(SubCommandContext, {
          command,
        }),
      ),
  )

export const currentSubCommand = SubCommandContext.accessWith(_ => _.command)

export const optionsMap = ApplicationCommand.accessWith(IxHelpers.optionsMap)

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
  ApplicationCommand.accessWith(IxHelpers.getOption(name))

export const optionValue = (name: string) =>
  option(name).flatMap(_ =>
    _.flatMapNullable(a => a.value).match({
      onNone: () =>
        ApplicationCommand.accessWithEffect(data =>
          Effect.fail(new RequiredOptionNotFound(data, name)),
        ),
      onSome: Effect.succeed,
    }),
  )

export const optionValueOptional = (name: string) =>
  option(name).map(o => o.flatMapNullable(o => o.value))

export const modalValues = ModalSubmitData.accessWith(IxHelpers.componentsMap)

export const modalValueOption = (name: string) =>
  ModalSubmitData.accessWith(IxHelpers.componentValue(name))

export class ModalValueNotFound {
  readonly _tag = "ModalValueNotFound"
  constructor(readonly data: ModalSubmitDatum, readonly name: string) {}
}

export const modalValue = (name: string) =>
  ModalSubmitData.accessWithEffect(data =>
    IxHelpers.componentValue(name)(data).mapError(
      () => new ModalValueNotFound(data, name),
    ),
  )
