import type {
  ActionRow,
  Button,
  Component,
  PollAnswer,
  PollCreateRequest,
  PollMedia,
  SelectMenu,
  SelectOption,
  TextInput,
} from "dfx/types"
import { ButtonStyle, ComponentType, TextInputStyle } from "dfx/types"

export type UIComponent = Exclude<Component, ActionRow>

/**
 * Helper to create an Action Row grid.
 */
export const grid = (items: Array<Array<UIComponent>>): Array<ActionRow> =>
  items.map(
    (components): ActionRow => ({
      type: ComponentType.ACTION_ROW,
      components,
    }),
  )

/**
 * Helper to create a single column of components
 */
export const singleColumn = (items: Array<UIComponent>): Array<ActionRow> =>
  items.map(c => ({
    type: ComponentType.ACTION_ROW,
    components: [c],
  }))

/**
 * Helper to create a button component.
 */
export const button = (button: Partial<Button>): Button => ({
  type: ComponentType.BUTTON,
  style: ButtonStyle.PRIMARY,
  ...button,
})

type BasicSelect = Omit<SelectMenu, "type" | "channel_types" | "options">

type StringSelect = BasicSelect & {
  options: Array<SelectOption>
}

type ChannelSelect = Omit<SelectMenu, "type" | "options">

/**
 * Helper to create a select component.
 */
export const select = (select: StringSelect): SelectMenu => ({
  type: ComponentType.STRING_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const userSelect = (select: BasicSelect): SelectMenu => ({
  type: ComponentType.USER_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const roleSelect = (select: BasicSelect): SelectMenu => ({
  type: ComponentType.ROLE_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const mentionableSelect = (select: BasicSelect): SelectMenu => ({
  type: ComponentType.MENTIONABLE_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const channelSelect = (select: ChannelSelect): SelectMenu => ({
  type: ComponentType.CHANNEL_SELECT,
  ...select,
})

type TextInputOpts = Omit<TextInput, "type" | "style"> & {
  style?: TextInputStyle
}

/**
 * Helper to create a text input
 */
export const textInput = (input: TextInputOpts): TextInput => ({
  type: ComponentType.TEXT_INPUT,
  style: TextInputStyle.SHORT,
  ...input,
})

/**
 * Helper to create a poll
 */
export const poll = (
  input: Omit<PollCreateRequest, "answers"> & {
    readonly answers: ReadonlyArray<PollMedia>
  },
): PollCreateRequest => ({
  ...input,
  answers: input.answers.map(poll_media => ({ poll_media }) as PollAnswer),
})
