import * as Arr from "@effect/data/ReadonlyArray"
import { Effect, EffectTypeId } from "@effect/io/Effect"

export const InteractionContext = Tag<Discord.Interaction>()
export const ApplicationCommandContext = Tag<Discord.ApplicationCommandDatum>()
export const MessageComponentContext = Tag<Discord.MessageComponentDatum>()
export const ModalSubmitContext = Tag<Discord.ModalSubmitDatum>()

export interface FocusedOptionContext {
  readonly focusedOption: Discord.ApplicationCommandInteractionDataOption
}
export const FocusedOptionContext = Tag<FocusedOptionContext>()

export interface SubCommandContext {
  readonly command: Discord.ApplicationCommandInteractionDataOption
}
export const SubCommandContext = Tag<SubCommandContext>()

export const interaction = InteractionContext

export const command = ApplicationCommandContext

export class ResolvedDataNotFound {
  readonly _tag = "ResolvedDataNotFound"
  constructor(readonly data: Discord.Interaction, readonly name?: string) {}
}

export const resolvedValues = <A>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  InteractionContext.flatMap(ix =>
    IxHelpers.resolveValues(f)(ix).match(
      () => Effect.fail(new ResolvedDataNotFound(ix)),
      Effect.succeed,
    ),
  )

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  InteractionContext.flatMap(ix =>
    IxHelpers.resolveOptionValue(
      name,
      f,
    )(ix).match(
      () => Effect.fail(new ResolvedDataNotFound(ix, name)),
      Effect.succeed,
    ),
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
  ApplicationCommandContext.flatMap(data =>
    Arr.findFirst(IxHelpers.allSubCommands(data), _ => !!commands[_.name])
      .mapError(() => new SubCommandNotFound(data))
      .flatMap(command =>
        commands[command.name].provideService(SubCommandContext, {
          command,
        }),
      ),
  )

export const currentSubCommand = SubCommandContext.map(_ => _.command)

export const optionsMap = ApplicationCommandContext.map(IxHelpers.optionsMap)

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
  ApplicationCommandContext.map(IxHelpers.getOption(name))

export const optionValue = (name: string) =>
  option(name).flatMap(_ =>
    _.flatMapNullable(a => a.value).match(
      () =>
        command.flatMap(data =>
          Effect.fail(new RequiredOptionNotFound(data, name)),
        ),
      Effect.succeed,
    ),
  )

export const optionValueOptional = (name: string) =>
  option(name).map(o => o.flatMapNullable(o => o.value))

export const modalValues = ModalSubmitContext.map(IxHelpers.componentsMap)
