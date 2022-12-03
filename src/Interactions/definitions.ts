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

export type InteractionHandler<R, E, Type, Data, HasMessage = false> = (
  a: Interaction<Type, Data, HasMessage>,
) => Effect<R, E, void>

export type InteractionDefinition<R, E> =
  | GlobalApplicationCommand<R, E>
  | GuildApplicationCommand<R, E>
  | MessageComponent<R, E>
  | ModalSubmit<R, E>
  | Autocomplete<R, E>

export class GlobalApplicationCommand<R, E> {
  readonly _tag = "GlobalApplicationCommand"
  constructor(
    readonly command: Discord.CreateGlobalApplicationCommandParams,
    readonly handle: InteractionHandler<
      R,
      E,
      Discord.InteractionType.APPLICATION_COMMAND,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const global = <R, E>(
  command: Discord.CreateGlobalApplicationCommandParams,
  handle: InteractionHandler<
    R,
    E,
    Discord.InteractionType.APPLICATION_COMMAND,
    Discord.ApplicationCommandDatum
  >,
) => new GlobalApplicationCommand(command, handle)

export class GuildApplicationCommand<R, E> {
  readonly _tag = "GuildApplicationCommand"
  constructor(
    readonly command: Discord.CreateGlobalApplicationCommandParams,
    readonly handle: InteractionHandler<
      R,
      E,
      Discord.InteractionType.APPLICATION_COMMAND,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const guild = <R, E>(
  command: Discord.CreateGuildApplicationCommandParams,
  handle: InteractionHandler<
    R,
    E,
    Discord.InteractionType.APPLICATION_COMMAND,
    Discord.ApplicationCommandDatum
  >,
) => new GuildApplicationCommand(command, handle)

export class MessageComponent<R, E> {
  readonly _tag = "MessageComponent"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: InteractionHandler<
      R,
      E,
      Discord.InteractionType.MESSAGE_COMPONENT,
      Discord.MessageComponentDatum,
      true
    >,
  ) {}
}

export const messageComponent = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: InteractionHandler<
    R2,
    E2,
    Discord.InteractionType.MESSAGE_COMPONENT,
    Discord.MessageComponentDatum,
    true
  >,
) => new MessageComponent<R1 | R2, E1 | E2>(pred, handle)

export class ModalSubmit<R, E> {
  readonly _tag = "ModalSubmit"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: InteractionHandler<
      R,
      E,
      Discord.InteractionType.MODAL_SUBMIT,
      Discord.ModalSubmitDatum,
      true
    >,
  ) {}
}

export const modalSubmit = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: InteractionHandler<
    R2,
    E2,
    Discord.InteractionType.MODAL_SUBMIT,
    Discord.ModalSubmitDatum,
    true
  >,
) => new ModalSubmit<R1 | R2, E1 | E2>(pred, handle)

export class Autocomplete<R, E> {
  readonly _tag = "Autocomplete"
  constructor(
    readonly predicate: (
      focusedOption: Discord.ApplicationCommandInteractionDataOption,
    ) => Effect<R, E, boolean>,
    readonly handle: InteractionHandler<
      R,
      E,
      Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
      Discord.ApplicationCommandDatum
    >,
  ) {}
}

export const autocomplete = <R1, R2, E1, E2>(
  pred: (
    focusedOption: Discord.ApplicationCommandInteractionDataOption,
  ) => Effect<R1, E1, boolean>,
  handle: InteractionHandler<
    R2,
    E2,
    Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
    Discord.ApplicationCommandDatum
  >,
) => new Autocomplete<R1 | R2, E1 | E2>(pred, handle)
