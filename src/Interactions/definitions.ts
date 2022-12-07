import { Effect, EffectTypeId } from "@effect/io/Effect"
import {
  RequiredOptionNotFound,
  ResolvedDataNotFound,
  SubCommandContext,
  SubCommandNotFound,
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
  command: A,
  handle: DescriptionMissing<A> extends true
    ? "command description is missing"
    : CommandHandler<R, E, A>,
) =>
  new GuildApplicationCommand<
    Exclude<R, Discord.Interaction | Discord.ApplicationCommandDatum>,
    E
  >(command, handle as any)

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
      | Discord.ApplicationCommandInteractionDataOption
    >,
    E1 | E2
  >(pred as any, handle as any)

// Command handler helpers
type CommandHandler<R, E, A = any> =
  | Effect<R, E, Discord.InteractionResponse>
  | CommandHandlerFn<R, E, A>

export interface CommandHelper<A> {
  resolve: <T>(
    name: Resolvables<A>["name"],
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ) => Effect<Discord.Interaction, ResolvedDataNotFound, T>

  option: (
    name: CommandOptions<A>["name"],
  ) => Effect<
    Discord.ApplicationCommandDatum,
    never,
    Maybe<Discord.ApplicationCommandInteractionDataOption>
  >

  optionValue: (
    name: RequiredCommandOptions<A>["name"],
  ) => Effect<Discord.ApplicationCommandDatum, RequiredOptionNotFound, string>

  optionValueOptional: (
    name: CommandOptions<A>["name"],
  ) => Effect<Discord.ApplicationCommandDatum, never, Maybe<string>>

  subCommandOption: (
    name: SubCommandOptions<A>["name"],
  ) => Effect<
    SubCommandContext,
    never,
    Maybe<Discord.ApplicationCommandInteractionDataOption>
  >

  subCommandOptionValue: (
    name: RequiredSubCommandOptions<A>["name"],
  ) => Effect<SubCommandContext, RequiredOptionNotFound, string>

  subCommandOptionValueOptional: (
    name: SubCommandOptions<A>["name"],
  ) => Effect<SubCommandContext, never, Maybe<string>>

  subCommands: <
    NER extends SubCommands<A> extends never
      ? never
      : Record<
          SubCommands<A>["name"],
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
    | ([NER[keyof NER]] extends [
        { [EffectTypeId]: { _E: (_: never) => infer E } },
      ]
        ? E
        : never)
    | SubCommandNotFound,
    Discord.InteractionResponse
  >
}

type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect<R, E, Discord.InteractionResponse>

// Extract option names
type ExtractOptions<A, T> = A extends {
  type: T
  name: string
  options?: Discord.ApplicationCommandOption[]
}
  ? A
  : A extends {
      options: Discord.ApplicationCommandOption[]
    }
  ? ExtractOptions<A["options"][number], T>
  : never

type RequiredOptions<A, T> = A extends {
  options: Discord.ApplicationCommandOption[]
}
  ? Extract<A["options"][number], { type: T; required: true }>
  : never

type CommandOptions<A> = ExtractOptions<
  A,
  Exclude<
    Discord.ApplicationCommandOptionType,
    | Discord.ApplicationCommandOptionType.SUB_COMMAND
    | Discord.ApplicationCommandOptionType.SUB_COMMAND_GROUP
  >
>

type RequiredCommandOptions<A> = RequiredOptions<
  A,
  Exclude<
    Discord.ApplicationCommandOptionType,
    | Discord.ApplicationCommandOptionType.SUB_COMMAND
    | Discord.ApplicationCommandOptionType.SUB_COMMAND_GROUP
  >
>

type SubCommands<A> = ExtractOptions<
  A,
  Discord.ApplicationCommandOptionType.SUB_COMMAND
>

type SubCommandOptions<A> = Exclude<
  SubCommands<A>["options"],
  undefined
>[number]

type RequiredSubCommandOptions<A> = Extract<
  Exclude<SubCommands<A>["options"], undefined>[number],
  { required: true }
>

type Resolvables<A> = ExtractOptions<
  A,
  | Discord.ApplicationCommandOptionType.ROLE
  | Discord.ApplicationCommandOptionType.USER
  | Discord.ApplicationCommandOptionType.MENTIONABLE
  | Discord.ApplicationCommandOptionType.CHANNEL
>
