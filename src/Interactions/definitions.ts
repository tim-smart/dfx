export type InteractionResponse =
  | {
      type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE
      data: Discord.InteractionCallbackMessage
    }
  | {
      type: Discord.InteractionCallbackType.UPDATE_MESSAGE
      data: Discord.InteractionCallbackMessage
    }
  | {
      type: Discord.InteractionCallbackType.MODAL
      data: Discord.InteractionCallbackModal
    }
  | {
      type: Discord.InteractionCallbackType.DEFERRED_UPDATE_MESSAGE
    }
  | {
      type: Discord.InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
    }
  | {
      type: Discord.InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
      data: Discord.InteractionCallbackAutocomplete
    }

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
    readonly handle: Effect<R, E, InteractionResponse>,
  ) {}
}

export const global = <R, E>(
  command: Discord.CreateGlobalApplicationCommandParams,
  handle: Effect<R, E, InteractionResponse>,
) =>
  new GlobalApplicationCommand<
    Exclude<R, Discord.Interaction | Discord.ApplicationCommandDatum>,
    E
  >(command, handle as any)

export class GuildApplicationCommand<R, E> {
  readonly _tag = "GuildApplicationCommand"
  constructor(
    readonly command: Discord.CreateGuildApplicationCommandParams,
    readonly handle: Effect<R, E, InteractionResponse>,
  ) {}
}

export const guild = <R, E>(
  command: Discord.CreateGuildApplicationCommandParams,
  handle: Effect<R, E, InteractionResponse>,
) =>
  new GuildApplicationCommand<
    Exclude<R, Discord.Interaction | Discord.ApplicationCommandDatum>,
    E
  >(command, handle as any)

export class MessageComponent<R, E> {
  readonly _tag = "MessageComponent"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, InteractionResponse>,
  ) {}
}

export const messageComponent = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: Effect<R2, E2, InteractionResponse>,
) =>
  new MessageComponent<
    Exclude<R1 | R2, Discord.Interaction | Discord.MessageComponentDatum>,
    E1 | E2
  >(pred as any, handle as any)

export class ModalSubmit<R, E> {
  readonly _tag = "ModalSubmit"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, InteractionResponse>,
  ) {}
}

export const modalSubmit = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: Effect<R2, E2, InteractionResponse>,
) =>
  new ModalSubmit<
    Exclude<R1 | R2, Discord.Interaction | Discord.ModalSubmitDatum>,
    E1 | E2
  >(pred as any, handle as any)

export class Autocomplete<R, E> {
  readonly _tag = "Autocomplete"
  constructor(
    readonly predicate: (
      focusedOption: Discord.ApplicationCommandInteractionDataOption,
    ) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, InteractionResponse>,
  ) {}
}

export const autocomplete = <R1, R2, E1, E2>(
  pred: (
    focusedOption: Discord.ApplicationCommandInteractionDataOption,
  ) => Effect<R1, E1, boolean>,
  handle: Effect<R2, E2, InteractionResponse>,
) =>
  new Autocomplete<
    Exclude<
      R1 | R2,
      | Discord.Interaction
      | Discord.ApplicationCommandDatum
      | Discord.ApplicationCommandInteractionDataOption
    >,
    E1 | E2
  >(pred as any, handle as any)
