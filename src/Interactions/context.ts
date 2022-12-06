import { InteractionResponse } from "./definitions.js"
import { DefinitionNotFound, Handler } from "./handlers.js"
import * as Arr from "@fp-ts/data/ReadonlyArray"
import { optionsMap } from "dfx/Helpers/interactions"
import { EffectTypeId, Effect } from "@effect/io/Effect"

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

export const getCommand = Effect.service(ApplicationCommandContext)

export class ResolvedDataNotFound {
  readonly _tag = "ResolvedDataNotFound"
  constructor(
    readonly data: Discord.ApplicationCommandDatum,
    readonly name: string,
  ) {}
}

export const getResolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
) =>
  Effect.serviceWithEffect(ApplicationCommandContext)((a) =>
    IxHelpers.resolveOptionValue(
      name,
      f,
    )(a).match(
      () => Effect.fail(new ResolvedDataNotFound(a, name)),
      Effect.succeed,
    ),
  )

export const focusedOptionValue = Effect.serviceWith(FocusedOptionContext)(
  (a) => a.focusedOption.value ?? "",
)

export const commandOptionsMap = Effect.serviceWith(ApplicationCommandContext)(
  optionsMap,
)

export class SubCommandNotFound {
  readonly _tag = "SubCommandNotFound"
  constructor(readonly data: Discord.ApplicationCommandDatum) {}
}

export const handleSubCommands = <
  NER extends Record<string, Effect<any, any, Maybe<InteractionResponse>>>,
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
  Maybe<InteractionResponse>
> =>
  Effect.service(ApplicationCommandContext).flatMap((data) =>
    pipe(
      IxHelpers.allSubCommands(data),
      Arr.findFirst((a) => !!commands[a.name]),
      (o) => o.toEither(() => new SubCommandNotFound(data)),
      Effect.fromEither,
      (a) =>
        a.flatMap((command) =>
          pipe(
            commands[command.name],
            Effect.provideService(SubCommandContext)({ command }),
          ),
        ),
    ),
  )

export const getSubCommand = Effect.serviceWith(SubCommandContext)(
  (a) => a.command,
)

export const subCommandOptionsMap = getSubCommand.map(IxHelpers.optionsMap)

export const modalValues = Effect.serviceWith(ModalSubmitContext)(
  IxHelpers.componentsMap,
)
