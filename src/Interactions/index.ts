import * as Effect from "@effect/io/Effect"
import * as Discord from "dfx/types"

export { response } from "../Helpers/interactions.js"
export * from "./builder.js"
export * from "./context.js"
export {
  InteractionDefinition,
  autocomplete,
  global,
  guild,
  messageComponent,
  modalSubmit,
} from "./definitions.js"

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
