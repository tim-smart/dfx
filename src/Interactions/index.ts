export { response } from "../Helpers/interactions.ts"
export * from "./builder.ts"
export * from "./context.ts"
export type { InteractionDefinition } from "./definitions.ts"
export {
  autocomplete,
  global,
  guild,
  messageComponent,
  modalSubmit,
} from "./definitions.ts"

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
