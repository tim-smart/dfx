import { Effect, EffectTypeId } from "@effect/io/Effect"
import {
  FocusedOptionContext,
  ResolvedDataNotFound,
  SubCommandContext,
} from "./context.js"

type DescriptionMissing<A> = [A] extends [
  {
    readonly type: Exclude<Discord.ApplicationCommandType, 1>
  },
]
  ? false
  : A extends { readonly description: string }
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
  const A extends DeepReadonlyObject<Discord.CreateGlobalApplicationCommandParams>,
>(
  command: A,
  handle: [DescriptionMissing<A>] extends [true]
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
  const A extends DeepReadonlyObject<Discord.CreateGuildApplicationCommandParams>,
>(
  command: A,
  handle: [DescriptionMissing<A>] extends [true]
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
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type CommandHandler<R, E, A = any> =
  | Effect<R, E, Discord.InteractionResponse>
  | CommandHandlerFn<R, E, A>

export interface CommandHelper<A> {
  resolve: <T>(
    name: AllResolvables<A>["name"],
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ) => Effect<Discord.Interaction, ResolvedDataNotFound, T>

  option: (
    name: AllCommandOptions<A>["name"],
  ) => Effect<
    Discord.ApplicationCommandDatum,
    never,
    Maybe<Discord.ApplicationCommandInteractionDataOption>
  >

  optionValue: <N extends AllRequiredCommandOptions<A>["name"]>(
    name: N,
  ) => Effect<Discord.ApplicationCommandDatum, never, CommandValue<A, N>>

  optionValueOptional: <N extends AllCommandOptions<A>["name"]>(
    name: N,
  ) => Effect<Discord.ApplicationCommandDatum, never, Maybe<CommandValue<A, N>>>

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

export type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect<R, E, Discord.InteractionResponse>

interface CommandOption {
  readonly type: any
  readonly name: string
  readonly options?: ReadonlyArray<CommandOption>
}

// == Sub commands
type SubCommands<A> = A extends {
  readonly type: Discord.ApplicationCommandOptionType.SUB_COMMAND
  readonly options?: ReadonlyArray<CommandOption>
}
  ? A
  : A extends { readonly options: ReadonlyArray<CommandOption> }
  ? SubCommands<A["options"][number]>
  : never

type SubCommandNames<A> = Option<SubCommands<A>>["name"]

// == Command options
type CommandOptionType = Exclude<
  Discord.ApplicationCommandOptionType,
  | Discord.ApplicationCommandOptionType.SUB_COMMAND
  | Discord.ApplicationCommandOptionType.SUB_COMMAND_GROUP
>

type CommandOptions<A> = OptionsWithLiteral<
  A,
  {
    readonly type: CommandOptionType
  }
>

type SubCommandOptions<A> = Extract<
  Option<Exclude<SubCommands<A>["options"], undefined>[number]>,
  {
    readonly type: CommandOptionType
  }
>

type AllCommandOptions<A> = CommandOptions<A> | SubCommandOptions<A>

type CommandWithName<A, N> = Extract<AllCommandOptions<A>, { readonly name: N }>

type OptionTypeValue = {
  [Discord.ApplicationCommandOptionType.BOOLEAN]: boolean
  [Discord.ApplicationCommandOptionType.INTEGER]: number
  [Discord.ApplicationCommandOptionType.NUMBER]: number
}
type CommandValue<A, N> = CommandWithName<
  A,
  N
>["type"] extends keyof OptionTypeValue
  ? OptionTypeValue[CommandWithName<A, N>["type"]]
  : string

// == Required options
type RequiredCommandOptions<A> = OptionsWithLiteral<
  A,
  {
    readonly type: CommandOptionType
    readonly required: true
  }
>

type RequiredSubCommandOptions<A> = Extract<
  SubCommandOptions<A>,
  { readonly required: true }
>

type AllRequiredCommandOptions<A> =
  | RequiredCommandOptions<A>
  | RequiredSubCommandOptions<A>

// == Resolveables
type ResolvableType =
  | Discord.ApplicationCommandOptionType.ROLE
  | Discord.ApplicationCommandOptionType.USER
  | Discord.ApplicationCommandOptionType.MENTIONABLE
  | Discord.ApplicationCommandOptionType.CHANNEL

type Resolvables<A> = OptionsWithLiteral<A, { readonly type: ResolvableType }>
type SubCommandResolvables<A> = Extract<
  Option<Exclude<SubCommands<A>["options"], undefined>[number]>,
  {
    readonly type: ResolvableType
  }
>
type AllResolvables<A> = Resolvables<A> | SubCommandResolvables<A>

// == Utilities
type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never

type Option<A> = A extends { readonly name: infer N }
  ? N extends StringLiteral<N>
    ? A
    : never
  : never

type OptionsWithLiteral<A, T> = A extends {
  readonly options: ReadonlyArray<CommandOption>
}
  ? Extract<A["options"][number], Option<A["options"][number]> & T>
  : never
