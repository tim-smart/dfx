import { Tag } from "@effect/data/Context"
import type * as HashMap from "@effect/data/HashMap"
import * as Option from "@effect/data/Option"
import * as Arr from "@effect/data/ReadonlyArray"
import * as Effect from "@effect/io/Effect"
import * as IxHelpers from "dfx/Helpers/interactions"
import type * as Discord from "dfx/types"

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
  constructor(
    readonly data: Discord.Interaction,
    readonly name?: string,
  ) {}
}

export const resolvedValues = <A>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<Discord.Interaction, ResolvedDataNotFound, ReadonlyArray<A>> =>
  Effect.flatMap(Interaction, ix =>
    Effect.mapError(
      IxHelpers.resolveValues(f)(ix),
      () => new ResolvedDataNotFound(ix),
    ),
  )

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<Discord.Interaction, ResolvedDataNotFound, A> =>
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
    Effect.Effect<any, any, Discord.InteractionResponse>
  >,
>(
  commands: NER,
): Effect.Effect<
  | Exclude<
      [NER[keyof NER]] extends [
        { [Effect.EffectTypeId]: { _R: (_: never) => infer R } },
      ]
        ? R
        : never,
      SubCommandContext
    >
  | Discord.Interaction
  | Discord.ApplicationCommandDatum,
  | ([NER[keyof NER]] extends [
      { [Effect.EffectTypeId]: { _E: (_: never) => infer E } },
    ]
      ? E
      : never)
  | SubCommandNotFound,
  Discord.InteractionResponse
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
  SubCommandContext,
  never,
  Discord.ApplicationCommandInteractionDataOption
> = Effect.map(SubCommandContext, _ => _.command)

export const optionsMap: Effect.Effect<
  Discord.ApplicationCommandDatum,
  never,
  HashMap.HashMap<string, string | undefined>
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
