type Interaction<Type, Data, HasMessage = false> = Omit<
  Discord.Interaction,
  "type" | "data" | "message"
> & {
  type: Type
  data: Data
} & (HasMessage extends true
    ? {
        message: Discord.Message
      }
    : {})

export type InteractionHandler<R, Type, Data, HasMessage = false> = (
  a: Interaction<Type, Data, HasMessage>,
) => Effect<R, never, void>

export type InteractionDefinition<R> =
  | GlobalApplicationCommand<R>
  | GuildApplicationCommand<R>
  | MessageComponent<R>
  | ModalSubmit<R>
  | Autocomplete<R>

export class GlobalApplicationCommand<R> {
  readonly _tag = "GlobalApplicationCommand"
  constructor(
    readonly command: Discord.CreateGlobalApplicationCommandParams,
    readonly handle: InteractionHandler<
      R,
      Discord.InteractionType.APPLICATION_COMMAND,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const global = <R>(
  command: Discord.CreateGlobalApplicationCommandParams,
  handle: InteractionHandler<
    R,
    Discord.InteractionType.APPLICATION_COMMAND,
    Discord.ApplicationCommandDatum
  >,
) => new GlobalApplicationCommand(command, handle)

export class GuildApplicationCommand<R> {
  readonly _tag = "GuildApplicationCommand"
  constructor(
    readonly command: Discord.CreateGlobalApplicationCommandParams,
    readonly handle: InteractionHandler<
      R,
      Discord.InteractionType.APPLICATION_COMMAND,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const guild = <R>(
  command: Discord.CreateGuildApplicationCommandParams,
  handle: InteractionHandler<
    R,
    Discord.InteractionType.APPLICATION_COMMAND,
    Discord.ApplicationCommandDatum
  >,
) => new GuildApplicationCommand(command, handle)

export class MessageComponent<R> {
  readonly _tag = "MessageComponent"
  constructor(
    readonly predicate: (customId: string) => Effect<R, never, boolean>,
    readonly handle: InteractionHandler<
      R,
      Discord.InteractionType.MESSAGE_COMPONENT,
      Discord.MessageComponentDatum,
      true
    >,
  ) {}
}

export const messageComponent = <R1, R2>(
  pred: (customId: string) => Effect<R1, never, boolean>,
  handle: InteractionHandler<
    R2,
    Discord.InteractionType.MESSAGE_COMPONENT,
    Discord.MessageComponentDatum,
    true
  >,
) => new MessageComponent<R1 | R2>(pred, handle)

export class ModalSubmit<R> {
  readonly _tag = "ModalSubmit"
  constructor(
    readonly predicate: (customId: string) => Effect<R, never, boolean>,
    readonly handle: InteractionHandler<
      R,
      Discord.InteractionType.MODAL_SUBMIT,
      Discord.ModalSubmitDatum,
      true
    >,
  ) {}
}

export const modalSubmit = <R1, R2>(
  pred: (customId: string) => Effect<R1, never, boolean>,
  handle: InteractionHandler<
    R2,
    Discord.InteractionType.MODAL_SUBMIT,
    Discord.ModalSubmitDatum,
    true
  >,
) => new ModalSubmit<R1 | R2>(pred, handle)

export class Autocomplete<R> {
  readonly _tag = "Autocomplete"
  constructor(
    readonly predicate: (
      focusedOption: Discord.ApplicationCommandInteractionDataOption,
    ) => Effect<R, never, boolean>,
    readonly handle: InteractionHandler<
      R,
      Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const autocomplete = <R1, R2>(
  pred: (
    focusedOption: Discord.ApplicationCommandInteractionDataOption,
  ) => Effect<R1, never, boolean>,
  handle: InteractionHandler<
    R2,
    Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
    Discord.ApplicationCommandDatum
  >,
) => new Autocomplete<R1 | R2>(pred, handle)
