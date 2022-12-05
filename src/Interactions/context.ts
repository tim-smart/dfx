import { InteractionResponse } from "./definitions.js"
import { InteractionNotFound } from "./handlers.js"
import * as Arr from "@fp-ts/data/ReadonlyArray"
import { optionsMap } from "dfx/Helpers/interactions"

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

export const focusedOptionValue = Effect.serviceWith(FocusedOptionContext)(
  (a) => a.focusedOption.value ?? "",
)

export const commandOptionsMap = Effect.serviceWith(ApplicationCommandContext)(
  optionsMap,
)

export const handleSubCommands = <
  NER extends Record<string, Effect<any, any, InteractionResponse>>,
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
  [NER[keyof NER]] extends [{ [EffectTypeId]: { _E: (_: never) => infer E } }]
    ? E
    : never,
  InteractionResponse
> =>
  Effect.struct({
    interaction: Effect.service(InteractionContext),
    data: Effect.service(ApplicationCommandContext),
  }).flatMap(({ interaction, data }) =>
    pipe(
      IxHelpers.allSubCommands(data),
      Arr.findFirst((a) => !!commands[a.name]),
      (o) => o.toEither(() => new InteractionNotFound(interaction)),
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
