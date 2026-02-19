import * as IxHelpers from "../Helpers/interactions.ts"
import type * as Discord from "../types.ts"
import type { NoSuchElementError } from "effect/Cause"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import * as ServiceMap from "effect/ServiceMap"

export class Interaction extends ServiceMap.Service<
  Interaction,
  Discord.APIInteraction
>()("dfx/Interactions/Interaction") {}
export type DiscordInteraction = Interaction

export class ApplicationCommand extends ServiceMap.Service<
  ApplicationCommand,
  Discord.APIApplicationCommandInteraction["data"]
>()("dfx/Interactions/ApplicationCommand") {}
export type DiscordApplicationCommand = ApplicationCommand

export class MessageComponentData extends ServiceMap.Service<
  MessageComponentData,
  Discord.APIMessageComponentInteractionData
>()("dfx/Interactions/MessageComponentData") {}
export type DiscordMessageComponent = MessageComponentData

export class ModalSubmitData extends ServiceMap.Service<
  ModalSubmitData,
  Discord.APIModalSubmission
>()("dfx/Interactions/ModalSubmitData") {}
export type DiscordModalSubmit = ModalSubmitData

export class FocusedOptionContext extends ServiceMap.Service<
  FocusedOptionContext,
  Discord.APIApplicationCommandInteractionDataOption
>()("dfx/Interactions/FocusedOptionContext") {}
export type DiscordFocusedOption = FocusedOptionContext

export interface SubCommandContextData {
  readonly command: Discord.APIApplicationCommandInteractionDataSubcommandOption
}
export class SubCommandContext extends ServiceMap.Service<
  SubCommandContext,
  SubCommandContextData
>()("dfx/Interactions/SubCommandContext") {}
export type DiscordSubCommand = SubCommandContext

export const resolvedValues = <A>(
  f: (
    id: Discord.Snowflake,
    data: Discord.InteractionDataResolved,
  ) => A | undefined,
): Effect.Effect<ReadonlyArray<A>, NoSuchElementError, DiscordInteraction> =>
  Interaction.use(ix => Effect.fromOption(IxHelpers.resolveValues(f)(ix)))

export const resolved = <A>(
  name: string,
  f: (
    id: Discord.Snowflake,
    data: Discord.InteractionDataResolved,
  ) => A | undefined,
): Effect.Effect<A, NoSuchElementError, DiscordInteraction> =>
  Interaction.use(ix =>
    Effect.fromOption(IxHelpers.resolveOptionValue(name, f)(ix)),
  )

export const focusedOptionValue = FocusedOptionContext.use(_ =>
  Effect.succeed("value" in _ ? _.value : ""),
)

export class SubCommandNotFound extends Data.TaggedError("SubCommandNotFound")<{
  data: Discord.APIApplicationCommandInteraction["data"]
}> {}

export const currentSubCommand: Effect.Effect<
  Discord.APIApplicationCommandInteractionDataSubcommandOption,
  never,
  DiscordSubCommand
> = SubCommandContext.use(_ => Effect.succeed(_.command))

export class RequiredOptionNotFound {
  readonly _tag = "RequiredOptionNotFound"
  constructor(
    readonly data:
      | Discord.APIApplicationCommandInteraction["data"]
      | Discord.APIApplicationCommandSubcommandOption,
    readonly name: string,
  ) {}
}

export const modalValues = ModalSubmitData.use(data =>
  Effect.succeed(IxHelpers.componentsMap(data)),
)

export const modalValueOption = (name: string) =>
  ModalSubmitData.use(data =>
    Effect.succeed(IxHelpers.componentValue(name)(data)),
  )

export const modalValue = (
  name: string,
): Effect.Effect<string, NoSuchElementError, DiscordModalSubmit> =>
  ModalSubmitData.use(data =>
    Effect.fromOption(IxHelpers.componentValue(name)(data)),
  )
