import { TypeIdError } from "@effect/platform/Error"
import * as IxHelpers from "dfx/Helpers/interactions"
import { InteractionsErrorTypeId } from "dfx/Interactions/error"
import type * as Discord from "dfx/types"
import type { NoSuchElementException } from "effect/Cause"
import { GenericTag } from "effect/Context"
import * as Effect from "effect/Effect"
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Types from "effect/Types"

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
export const FocusedOptionContext = GenericTag<
  DiscordFocusedOption,
  Discord.ApplicationCommandInteractionDataOption
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

export const resolvedValues = <A>(
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<
  ReadonlyArray<A>,
  NoSuchElementException,
  DiscordInteraction
> => Effect.flatMap(Interaction, ix => IxHelpers.resolveValues(f)(ix))

export const resolved = <A>(
  name: string,
  f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => A | undefined,
): Effect.Effect<A, NoSuchElementException, DiscordInteraction> =>
  Effect.flatMap(Interaction, ix => IxHelpers.resolveOptionValue(name, f)(ix))

export const focusedOptionValue = Effect.map(
  FocusedOptionContext,
  _ => _.value ?? "",
)

export class SubCommandNotFound extends TypeIdError(
  InteractionsErrorTypeId,
  "SubCommandNotFound",
)<{
  data: Discord.ApplicationCommandDatum
}> {}

export const currentSubCommand: Effect.Effect<
  Discord.ApplicationCommandInteractionDataOption,
  never,
  DiscordSubCommand
> = Effect.map(SubCommandContext, _ => _.command)

export class RequiredOptionNotFound {
  readonly _tag = "RequiredOptionNotFound"
  constructor(
    readonly data:
      | Discord.ApplicationCommandDatum
      | Discord.ApplicationCommandInteractionDataOption,
    readonly name: string,
  ) {}
}

export const modalValues = Effect.map(ModalSubmitData, IxHelpers.componentsMap)

export const modalValueOption = (name: string) =>
  Effect.map(ModalSubmitData, IxHelpers.componentValue(name))

export const modalValue = (
  name: string,
): Effect.Effect<string, NoSuchElementException, DiscordModalSubmit> =>
  Effect.flatMap(ModalSubmitData, data => IxHelpers.componentValue(name)(data))
