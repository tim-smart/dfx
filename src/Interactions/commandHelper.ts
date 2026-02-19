import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import {
  type DiscordSubCommand,
  SubCommandContext,
  SubCommandNotFound,
  type DiscordApplicationCommand,
  type DiscordInteraction,
} from "./context.ts"
import type * as Discord from "../types.ts"
import * as Helpers from "../Helpers/interactions.ts"
import * as Arr from "effect/Array"
import type { HashMap } from "effect/HashMap"

export class CommandHelper<A> {
  constructor(readonly interaction: Discord.APIInteraction) {
    this.target = Helpers.target(interaction.data as any) as any
    this.data = interaction.data as any
  }
  readonly data: Discord.APIApplicationCommandInteraction["data"]
  readonly target: CommandTypeMap<
    A,
    {
      [Discord.ApplicationCommandType
        .CHAT]: Discord.APIChatInputApplicationCommandGuildInteraction["data"]
      [Discord.ApplicationCommandType.MESSAGE]: Discord.MessageResponse
      [Discord.ApplicationCommandType.USER]: Discord.UserResponse
      [Discord.ApplicationCommandType.PRIMARY_ENTRY_POINT]: undefined
    }
  >

  resolve<T>(
    name: AllResolvables<A>["name"],
    f: (
      id: Discord.Snowflake,
      data: Discord.InteractionDataResolved,
    ) => T | undefined,
  ): Option.Option<T> {
    return Helpers.resolveOptionValue(name, f)(this.interaction)
  }

  resolvedValues<T>(
    f: (
      id: Discord.Snowflake,
      data: Discord.InteractionDataResolved,
    ) => T | undefined,
  ): Option.Option<ReadonlyArray<T>> {
    return Helpers.resolveValues(f)(this.interaction)
  }

  option(
    name: AllCommandOptions<A>["name"],
  ): Option.Option<Discord.APIApplicationCommandInteractionDataOption> {
    return Helpers.getOption(name)(this.data as any)
  }

  optionValue<N extends AllRequiredCommandOptions<A>["name"]>(
    name: N,
  ): CommandValue<A, N> {
    return Option.getOrThrow(this.optionValueOptional(name))
  }

  optionValueOptional<N extends AllCommandOptions<A>["name"]>(
    name: N,
  ): Option.Option<CommandValue<A, N>> {
    return Option.map(this.option(name), _ => (_ as any).value) as any
  }

  optionValueOrElse<N extends AllCommandOptions<A>["name"], const OrElse>(
    name: N,
    orElse: () => OrElse,
  ): CommandValue<A, N> {
    return Option.getOrElse(this.optionValueOptional(name), orElse) as any
  }

  subCommands<
    NER extends SubCommandNames<A> extends never
      ? never
      : Record<
          SubCommandNames<A>,
          Effect.Effect<Discord.CreateInteractionResponseRequest, any, any>
        >,
  >(
    commands: NER,
  ): Effect.Effect<
    Effect.Success<NER[keyof NER]>,
    Effect.Error<NER[keyof NER]>,
    | Exclude<Effect.Services<NER[keyof NER]>, DiscordSubCommand>
    | DiscordInteraction
    | DiscordApplicationCommand
  > {
    const commands_ = commands as Record<string, any>
    const command = Arr.findFirst(
      Helpers.allSubCommands(this.data),
      _ => !!commands_[_.name],
    )

    return Option.match(command, {
      onNone: () => Effect.fail(new SubCommandNotFound({ data: this.data })),
      onSome: command =>
        Effect.provideService(commands_[command.name], SubCommandContext, {
          command,
        }),
    }) as any
  }

  get optionsMap(): HashMap<string, string | undefined> {
    return Helpers.optionsMap(this.data as any)
  }
}

export type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect.Effect<Discord.CreateInteractionResponseRequest, E, R>

interface CommandOption {
  readonly type: any
  readonly name: string
  readonly options?: ReadonlyArray<CommandOption>
}

type CommandTypeMap<
  A,
  Options extends Record<Discord.ApplicationCommandType, any>,
> = A extends { readonly type: infer T }
  ? T extends keyof Options
    ? Options[T]
    : never
  : Options[typeof Discord.ApplicationCommandType.CHAT]

// == Sub commands
type SubCommands<A> = A extends {
  readonly type: typeof Discord.ApplicationCommandOptionType.SUB_COMMAND
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
  | typeof Discord.ApplicationCommandOptionType.SUB_COMMAND
  | typeof Discord.ApplicationCommandOptionType.SUB_COMMAND_GROUP
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
  | typeof Discord.ApplicationCommandOptionType.ROLE
  | typeof Discord.ApplicationCommandOptionType.USER
  | typeof Discord.ApplicationCommandOptionType.MENTIONABLE
  | typeof Discord.ApplicationCommandOptionType.CHANNEL

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
