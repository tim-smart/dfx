import type {
  ActionRowComponentForMessageRequest,
  ActionRowComponentForModalRequest,
  ButtonComponentForMessageRequest,
  ChannelSelectComponentForMessageRequest,
  ContainerComponentForMessageRequest,
  FileComponentForMessageRequest,
  MediaGalleryComponentForMessageRequest,
  MentionableSelectComponentForMessageRequest,
  MessageCreateRequest,
  PollAnswerCreateRequest,
  PollCreateRequest,
  PollMediaCreateRequest,
  RoleSelectComponentForMessageRequest,
  SectionComponentForMessageRequest,
  SeparatorComponentForMessageRequest,
  StringSelectComponentForMessageRequest,
  TextDisplayComponentForMessageRequest,
  TextInputComponentForModalRequest,
  ThumbnailComponentForMessageRequest,
  UserSelectComponentForMessageRequest,
} from "../types.ts"
import {
  TextInputStyleTypes,
  ButtonStyleTypes,
  MessageComponentTypes,
  MessageFlags,
} from "../types.ts"

type ActionRowComponents = ReadonlyArray<
  | ActionRowComponentForMessageRequest["components"][number]
  | ActionRowComponentForModalRequest["components"][number]
>

/**
 * Helper to create an Action Row.
 */
export const row = <const C extends ActionRowComponents>(
  components: C,
): {
  readonly type: typeof MessageComponentTypes.ACTION_ROW
  readonly components: C
} => ({
  type: MessageComponentTypes.ACTION_ROW,
  components,
})

/**
 * Helper to create an Action Row grid.
 */
export const grid = <C extends ActionRowComponents>(
  items: ReadonlyArray<C>,
): ReadonlyArray<{
  readonly type: typeof MessageComponentTypes.ACTION_ROW
  readonly components: C
}> => items.map(row)

/**
 * Helper to create a single column of components
 */
export const singleColumn = <C extends ActionRowComponents>(
  items: C,
): ReadonlyArray<{
  readonly type: typeof MessageComponentTypes.ACTION_ROW
  readonly components: C
}> => items.map(c => row([c as any])) as any

/**
 * Helper to create a button component.
 */
export const button = (
  options: Partial<ButtonComponentForMessageRequest>,
): ButtonComponentForMessageRequest => ({
  type: MessageComponentTypes.BUTTON,
  style: ButtonStyleTypes.PRIMARY,
  ...options,
})

/**
 * Helper to create a select component.
 */
export const select = (
  options: Omit<StringSelectComponentForMessageRequest, "type">,
): StringSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.STRING_SELECT,
  ...options,
})

/**
 * Helper to create a select component.
 */
export const userSelect = (
  options: Omit<UserSelectComponentForMessageRequest, "type">,
): UserSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.USER_SELECT,
  ...options,
})

/**
 * Helper to create a select component.
 */
export const roleSelect = (
  options: Omit<RoleSelectComponentForMessageRequest, "type">,
): RoleSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.ROLE_SELECT,
  ...options,
})

/**
 * Helper to create a select component.
 */
export const mentionableSelect = (
  options: Omit<MentionableSelectComponentForMessageRequest, "type">,
): MentionableSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.MENTIONABLE_SELECT,
  ...options,
})

/**
 * Helper to create a select component.
 */
export const channelSelect = (
  options: Omit<ChannelSelectComponentForMessageRequest, "type">,
): ChannelSelectComponentForMessageRequest => ({
  type: MessageComponentTypes.CHANNEL_SELECT,
  ...options,
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
 * Helper to create a thumbnail component
 */
export const thumbnail = (options: {
  readonly url: string
  readonly description?: string | undefined
  readonly spoiler?: boolean | undefined
}): ThumbnailComponentForMessageRequest => ({
  type: MessageComponentTypes.THUMBNAIL,
  description: options.description,
  spoiler: options.spoiler,
  media: { url: options.url },
})

/**
 * Helper to create a separator component
 */
export const seperator = (
  options?: Omit<SeparatorComponentForMessageRequest, "type">,
): SeparatorComponentForMessageRequest => ({
  type: MessageComponentTypes.SEPARATOR,
  ...options,
})

/**
 * Helper to create a text display component
 */
export const textDisplay = (
  content: string,
): TextDisplayComponentForMessageRequest => ({
  type: MessageComponentTypes.TEXT_DISPLAY,
  content,
})

type MessageComponents = NonNullable<MessageCreateRequest["components"]>[number]

/**
 * Create a components v2 message
 */
export const components = <const C extends ReadonlyArray<MessageComponents>>(
  items: C,
  options?: {
    readonly ephemeral?: boolean | undefined
  },
): {
  readonly flags: MessageFlags
  readonly components: C
} => ({
  flags: options?.ephemeral
    ? MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
    : MessageFlags.IsComponentsV2,
  components: items,
})
