import { Effect, EffectTypeId } from "@effect/io/Effect"
import {
  FocusedOptionContext,
  ResolvedDataNotFound,
  SubCommandContext,
} from "./context.js"
import type { F } from "ts-toolbelt"

type DescriptionMissing<A> = A extends {
  type: Exclude<Discord.ApplicationCommandType, 1>
}
  ? false
  : A extends { description: string }
  ? false
  : true

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
  A extends Discord.CreateGlobalApplicationCommandParams,
>(
  command: F.Narrow<A>,
  handle: DescriptionMissing<A> extends true
    ? "command description is missing"
    : CommandHandler<R, E, A>,
) =>
  new GlobalApplicationCommand<
    Exclude<R, Discord.Interaction | Discord.ApplicationCommandDatum>,
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
  A extends Discord.CreateGuildApplicationCommandParams,
>(
  command: F.Narrow<A>,
  handle: DescriptionMissing<A> extends true
    ? "command description is missing"
    : CommandHandler<R, E, A>,
) =>
  new GuildApplicationCommand<
    Exclude<R, Discord.Interaction | Discord.ApplicationCommandDatum>,
    E
  >(command as any, handle as any)

export class MessageComponent<R, E> {
  readonly _tag = "MessageComponent"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, Discord.InteractionResponse>,
  ) {}
}

export const messageComponent = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: CommandHandler<R2, E2, Discord.InteractionResponse>,
) =>
  new MessageComponent<
    Exclude<R1 | R2, Discord.Interaction | Discord.MessageComponentDatum>,
    E1 | E2
  >(pred as any, handle as any)

export class ModalSubmit<R, E> {
  readonly _tag = "ModalSubmit"
  constructor(
    readonly predicate: (customId: string) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, Discord.InteractionResponse>,
  ) {}
}

export const modalSubmit = <R1, R2, E1, E2>(
  pred: (customId: string) => Effect<R1, E1, boolean>,
  handle: Effect<R2, E2, Discord.InteractionResponse>,
) =>
  new ModalSubmit<
    Exclude<R1 | R2, Discord.Interaction | Discord.ModalSubmitDatum>,
    E1 | E2
  >(pred as any, handle as any)

export class Autocomplete<R, E> {
  readonly _tag = "Autocomplete"
  constructor(
    readonly predicate: (
      data: Discord.ApplicationCommandDatum,
      focusedOption: Discord.ApplicationCommandInteractionDataOption,
    ) => Effect<R, E, boolean>,
    readonly handle: Effect<R, E, Discord.InteractionResponse>,
  ) {}
}

export const autocomplete = <R1, R2, E1, E2>(
  pred: (
    data: Discord.ApplicationCommandDatum,
    focusedOption: Discord.ApplicationCommandInteractionDataOption,
  ) => Effect<R1, E1, boolean>,
  handle: Effect<R2, E2, Discord.InteractionResponse>,
) =>
  new Autocomplete<
    Exclude<
      R1 | R2,
      | Discord.Interaction
      | Discord.ApplicationCommandDatum
      | FocusedOptionContext
    >,
    E1 | E2
  >(pred as any, handle as any)

// ==== Command handler helpers

type CommandHandler<R, E, A = any> =
  | Effect<R, E, Discord.InteractionResponse>
  | CommandHandlerFn<R, E, A>

export interface CommandHelper<A> {
  resolve: <T>(
    name: Resolvables<A>["name"],
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ) => Effect<Discord.Interaction, ResolvedDataNotFound, T>

  option: (
    name: AllCommandOptions<A>["name"],
  ) => Effect<
    Discord.ApplicationCommandDatum,
    never,
    Maybe<Discord.ApplicationCommandInteractionDataOption>
  >

  optionValue: (
    name: AllRequiredCommandOptions<A>["name"],
  ) => Effect<Discord.ApplicationCommandDatum, never, string>

  optionValueOptional: (
    name: AllCommandOptions<A>["name"],
  ) => Effect<Discord.ApplicationCommandDatum, never, Maybe<string>>

  subCommands: <
    NER extends SubCommandNames<A> extends never
      ? never
      : Record<
          SubCommandNames<A>,
          Effect<any, any, Discord.InteractionResponse>
        >,
  >(
    commands: NER,
  ) => Effect<
    | Exclude<
        [NER[keyof NER]] extends [
          { [EffectTypeId]: { _R: (_: never) => infer R } },
        ]
          ? R
          : never,
        SubCommandContext
      >
    | Discord.Interaction
    | Discord.ApplicationCommandDatum,
    [NER[keyof NER]] extends [{ [EffectTypeId]: { _E: (_: never) => infer E } }]
      ? E
      : never,
    Discord.InteractionResponse
  >
}

type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect<R, E, Discord.InteractionResponse>

type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never

type Option<A> = A extends { name: infer N }
  ? N extends StringLiteral<N>
    ? A
    : never
  : never

type Options<A, T> = A extends T
  ? T
  : A extends { options: Discord.ApplicationCommandOption[] }
  ? Options<A["options"][number], T>
  : never

type OptionsWithLiteral<A, T> = A extends {
  options: Discord.ApplicationCommandOption[]
}
  ? Extract<A["options"][number], Option<A["options"][number]> & T>
  : never

type CommandOptionType = Exclude<
  Discord.ApplicationCommandOptionType,
  | Discord.ApplicationCommandOptionType.SUB_COMMAND
  | Discord.ApplicationCommandOptionType.SUB_COMMAND_GROUP
>

type CommandOptions<A> = OptionsWithLiteral<
  A,
  {
    name: string
    type: CommandOptionType
  }
>

type RequiredCommandOptions<A> = OptionsWithLiteral<
  A,
  {
    type: CommandOptionType
    name: string
    required: true
  }
>

type SubCommands<A> = A extends {
  name: string
  type: Discord.ApplicationCommandOptionType.SUB_COMMAND
  options?: Discord.ApplicationCommandOption[]
}
  ? A
  : A extends { options: Discord.ApplicationCommandOption[] }
  ? SubCommands<A["options"][number]>
  : never

type SubCommandNames<A> = Option<SubCommands<A>>["name"]

type SubCommandOptions<A> = Extract<
  Option<Exclude<SubCommands<A>["options"], undefined>[number]>,
  {
    type: CommandOptionType
  }
>

type AllCommandOptions<A> = CommandOptions<A> | SubCommandOptions<A>

type RequiredSubCommandOptions<A> = Extract<
  SubCommandOptions<A>,
  { required: true }
>

type AllRequiredCommandOptions<A> =
  | RequiredCommandOptions<A>
  | RequiredSubCommandOptions<A>

type Resolvables<A> = Options<
  A,
  {
    name: string
    type:
      | Discord.ApplicationCommandOptionType.ROLE
      | Discord.ApplicationCommandOptionType.USER
      | Discord.ApplicationCommandOptionType.MENTIONABLE
      | Discord.ApplicationCommandOptionType.CHANNEL
  }
>
