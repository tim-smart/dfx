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
export const id = (query: string) => (customId: string) => query === customId

export const idStartsWith = (query: string) => (customId: string) =>
  customId.startsWith(query)

export const idRegex = (query: RegExp) => (customId: string) =>
  query.test(customId)

export const option =
  (command: string, optionName: string) =>
  (data: { readonly name: string }, focusedOption: { readonly name: string }) =>
    data.name === command && focusedOption.name === optionName

export const optionOnly =
  (optionName: string) =>
  (_: unknown, focusedOption: { readonly name: string }) =>
    focusedOption.name === optionName
