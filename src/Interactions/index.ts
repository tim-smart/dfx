import * as Effect from "effect/Effect"
import type * as Discord from "dfx/types"

export { response } from "dfx/Helpers/interactions"
export * from "dfx/Interactions/builder"
export * from "dfx/Interactions/context"
export {
  autocomplete,
  global,
  guild,
  InteractionDefinition,
  messageComponent,
  modalSubmit,
} from "dfx/Interactions/definitions"

// Filters
export const id = (query: string) => (customId: string) =>
  Effect.succeed(query === customId)

export const idStartsWith = (query: string) => (customId: string) =>
  Effect.succeed(customId.startsWith(query))

export const idRegex = (query: RegExp) => (customId: string) =>
  Effect.succeed(query.test(customId))

export const option =
  (command: string, optionName: string) =>
  (
    data: Pick<Discord.ApplicationCommandDatum, "name">,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(data.name === command && focusedOption.name === optionName)

export const optionOnly =
  (optionName: string) =>
  (
    _: unknown,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(focusedOption.name === optionName)
