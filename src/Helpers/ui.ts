import type {
  ActionRowComponentForModalRequest,
  ButtonComponentForMessageRequest,
  ChannelSelectComponentForMessageRequest,
  ContainerComponentForMessageRequest,
  FileComponentForMessageRequest,
  MediaGalleryComponentForMessageRequest,
  MentionableSelectComponentForMessageRequest,
  PollAnswerCreateRequest,
  PollCreateRequest,
  PollMediaCreateRequest,
  RoleSelectComponentForMessageRequest,
  SectionComponentForMessageRequest,
  SeparatorComponentForMessageRequest,
  StringSelectComponentForMessageRequest,
  TextInputComponentForModalRequest,
  UserSelectComponentForMessageRequest,
} from "dfx/types"
import {
  TextInputStyleTypes,
  ButtonStyleTypes,
  MessageComponentTypes,
} from "dfx/types"

/**
 * Helper to create an Action Row grid.
 */
export const grid = (
  items: ReadonlyArray<ReadonlyArray<TextInputComponentForModalRequest>>,
): Array<ActionRowComponentForModalRequest> =>
  items.map(
    (components): ActionRowComponentForModalRequest => ({
      type: MessageComponentTypes.ACTION_ROW,
      components,
    }),
  )

/**
 * Helper to create a single column of components
 */
export const singleColumn = (
  items: Array<TextInputComponentForModalRequest>,
): Array<ActionRowComponentForModalRequest> =>
  items.map(c => ({
    type: MessageComponentTypes.ACTION_ROW,
    components: [c],
  }))

/**
 * Helper to create a button component.
 */
export const button = (
  button: Partial<ButtonComponentForMessageRequest>,
): ButtonComponentForMessageRequest => ({
  type: MessageComponentTypes.BUTTON,
  style: ButtonStyleTypes.PRIMARY,
  ...button,
})

/**
 * Helper to create a select component.
 */
export const select = (
  select: Omit<StringSelectComponentForMessageRequest, "type">,
): StringSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.STRING_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const userSelect = (
  select: Omit<UserSelectComponentForMessageRequest, "type">,
): UserSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.USER_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const roleSelect = (
  select: Omit<RoleSelectComponentForMessageRequest, "type">,
): RoleSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.ROLE_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const mentionableSelect = (
  select: Omit<MentionableSelectComponentForMessageRequest, "type">,
): MentionableSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.MENTIONABLE_SELECT,
  ...select,
})

/**
 * Helper to create a select component.
 */
export const channelSelect = (
  select: Omit<ChannelSelectComponentForMessageRequest, "type">,
): ChannelSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.CHANNEL_SELECT,
  ...select,
})

type TextInputOpts = Omit<
  TextInputComponentForModalRequest,
  "type" | "style"
> & {
  style?: TextInputStyleTypes
}

/**
 * Helper to create a text input
 */
export const textInput = (
  input: TextInputOpts,
): TextInputComponentForModalRequest => ({
  type: MessageComponentTypes.TEXT_INPUT,
  style: TextInputStyleTypes.SHORT,
  ...input,
})

/**
 * Helper to create a poll
 */
export const poll = (
  input: Omit<PollCreateRequest, "answers"> & {
    readonly answers: ReadonlyArray<PollMediaCreateRequest>
  },
): PollCreateRequest => ({
  ...input,
  answers: input.answers.map(
    poll_media => ({ poll_media }) as PollAnswerCreateRequest,
  ),
})

/**
 * Helper to create a media gallery
 */
export const mediaGallery = (
  options: Omit<MediaGalleryComponentForMessageRequest, "type">,
): MediaGalleryComponentForMessageRequest => ({
  type: MessageComponentTypes.MEDIA_GALLERY,
  ...options,
})

/**
 * Helper to create a file component
 */
export const file = (
  options: Omit<FileComponentForMessageRequest, "type">,
): FileComponentForMessageRequest => ({
  type: MessageComponentTypes.FILE,
  ...options,
})

/**
 * Helper to create a container component
 */
export const container = (
  options: Omit<ContainerComponentForMessageRequest, "type">,
): ContainerComponentForMessageRequest => ({
  type: MessageComponentTypes.CONTAINER,
  ...options,
})

/**
 * Helper to create a section component
 */
export const section = (
  options: Omit<SectionComponentForMessageRequest, "type">,
): SectionComponentForMessageRequest => ({
  type: MessageComponentTypes.SECTION,
  ...options,
})

/**
 * Helper to create a separator component
 */
export const seperator = (
  options: Omit<SeparatorComponentForMessageRequest, "type">,
): SeparatorComponentForMessageRequest => ({
  type: MessageComponentTypes.SEPARATOR,
  ...options,
})
