import type * as Effect from "effect/Effect"
import type {
  DiscordApplicationCommand,
  DiscordFocusedOption,
  DiscordInteraction,
  DiscordMessageComponent,
  DiscordModalSubmit,
} from "dfx/Interactions/context"
import type * as Discord from "dfx/types"
import type { Scope } from "effect/Scope"
import type { CommandHelper } from "./commandHelper"

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
    readonly handle: CommandHandler<R, E>,
  ) {}
}

export const global = <
  R,
  E,
  const A extends Discord.CreateGlobalApplicationCommandParams,
>(
  command: A,
  handle: CommandHandler<R, E, A>,
) =>
  new GlobalApplicationCommand<
    Exclude<R, DiscordInteraction | DiscordApplicationCommand | Scope>,
    E
  >(command as any, handle as any)

export class GuildApplicationCommand<R, E> {
  readonly _tag = "GuildApplicationCommand"
  constructor(
    readonly command: Discord.CreateGuildApplicationCommandParams,
    readonly handle: CommandHandler<R, E>,
  ) {}
}

export const guild = <
  R,
  E,
  const A extends Discord.CreateGuildApplicationCommandParams,
>(
  command: A,
  handle: CommandHandler<R, E, A>,
) =>
  new GuildApplicationCommand<
    Exclude<R, DiscordInteraction | DiscordApplicationCommand | Scope>,
    E
  >(command as any, handle as any)

export class MessageComponent<R, E> {
  readonly _tag = "MessageComponent"
  constructor(
    readonly predicate: (customId: string) => boolean,
    readonly handle: Effect.Effect<Discord.InteractionResponse, E, R>,
  ) {}
}

export const messageComponent = <R, E>(
  pred: (customId: string) => boolean,
  handle: CommandHandler<R, E, Discord.InteractionResponse>,
) =>
  new MessageComponent<
    Exclude<R, DiscordInteraction | DiscordMessageComponent | Scope>,
    E
  >(pred, handle as any)

export class ModalSubmit<R, E> {
  readonly _tag = "ModalSubmit"
  constructor(
    readonly predicate: (customId: string) => boolean,
    readonly handle: Effect.Effect<Discord.InteractionResponse, E, R>,
  ) {}
}

export const modalSubmit = <R, E>(
  pred: (customId: string) => boolean,
  handle: Effect.Effect<Discord.InteractionResponse, E, R>,
) =>
  new ModalSubmit<
    Exclude<R, DiscordInteraction | DiscordModalSubmit | Scope>,
    E
  >(pred, handle as any)

export class Autocomplete<R, E> {
  readonly _tag = "Autocomplete"
  constructor(
    readonly predicate: (
      data: Discord.ApplicationCommandDatum,
      focusedOption: Discord.ApplicationCommandInteractionDataOption,
    ) => boolean,
    readonly handle: Effect.Effect<Discord.InteractionResponse, E, R>,
  ) {}
}

export const autocomplete = <R, E>(
  pred: (
    data: Discord.ApplicationCommandDatum,
    focusedOption: Discord.ApplicationCommandInteractionDataOption,
  ) => boolean,
  handle: Effect.Effect<Discord.InteractionResponse, E, R>,
) =>
  new Autocomplete<
    Exclude<
      R,
      | DiscordInteraction
      | DiscordApplicationCommand
      | DiscordFocusedOption
      | Scope
    >,
    E
  >(pred, handle as any)

// ==== Command handler helpers
export type CommandHandler<R, E, A = any> =
  | Effect.Effect<Discord.InteractionResponse, E, R>
  | CommandHandlerFn<R, E, A>

export type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect.Effect<Discord.InteractionResponse, E, R>
