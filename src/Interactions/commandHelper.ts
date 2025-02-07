import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import {
  SubCommandContext,
  SubCommandNotFound,
  type DiscordApplicationCommand,
  type DiscordInteraction,
} from "dfx/Interactions/context"
import type * as Discord from "dfx/types"
import * as Helpers from "dfx/Helpers/interactions"
import * as Arr from "effect/Array"
import type { HashMap } from "effect/HashMap"

export class CommandHelper<A> {
  constructor(readonly interaction: Discord.Interaction) {
    this.target = Helpers.target(interaction.data as any) as any
    this.data = interaction.data as any
  }
  readonly data: Discord.ApplicationCommandDatum
  readonly target: CommandTypeMap<
    A,
    {
      [Discord.ApplicationCommandType
        .CHAT_INPUT]: Discord.ApplicationCommandDatum
      [Discord.ApplicationCommandType.MESSAGE]: Discord.Message
      [Discord.ApplicationCommandType.USER]: Discord.User
      [Discord.ApplicationCommandType.PRIMARY_ENTRY_POINT]: undefined
    }
  >

  resolve<T>(
    name: AllResolvables<A>["name"],
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ): Option.Option<T> {
    return Helpers.resolveOptionValue(name, f)(this.interaction)
  }

  resolvedValues<T>(
    f: (id: Discord.Snowflake, data: Discord.ResolvedDatum) => T | undefined,
  ): Option.Option<ReadonlyArray<T>> {
    return Helpers.resolveValues(f)(this.interaction)
  }

  option(
    name: AllCommandOptions<A>["name"],
  ): Option.Option<Discord.ApplicationCommandInteractionDataOption> {
    return Helpers.getOption(name)(this.data)
  }

  optionValue<N extends AllRequiredCommandOptions<A>["name"]>(
    name: N,
  ): CommandValue<A, N> {
    return Option.getOrThrow(this.optionValueOptional(name))
  }

  optionValueOptional<N extends AllCommandOptions<A>["name"]>(
    name: N,
  ): Option.Option<CommandValue<A, N>> {
    return Option.map(this.option(name), _ => _.value) as any
  }

  optionValueOrElse<N extends AllCommandOptions<A>["name"], const OrElse>(
    name: N,
    orElse: () => OrElse,
  ): CommandValue<A, N> {
    return Option.getOrElse(this.option(name), orElse) as any
  }

  subCommands<
    NER extends SubCommandNames<A> extends never
      ? never
      : Record<
          SubCommandNames<A>,
          Effect.Effect<Discord.InteractionResponse, any, any>
        >,
  >(
    commands: NER,
  ): Effect.Effect<
    Discord.InteractionResponse,
    [NER[keyof NER]] extends [
      { [Effect.EffectTypeId]: { _E: (_: never) => infer E } },
    ]
      ? E
      : never,
    | Exclude<
        [NER[keyof NER]] extends [
          { [Effect.EffectTypeId]: { _R: (_: never) => infer R } },
        ]
          ? R
          : never,
        SubCommandContext
      >
    | DiscordInteraction
    | DiscordApplicationCommand
  > {
    const commands_ = commands as Record<string, any>
    return Effect.mapError(
      Arr.findFirst(
        Helpers.allSubCommands(this.data),
        _ => !!commands_[_.name],
      ),
      () => new SubCommandNotFound({ data: this.data }),
    ).pipe(
      Effect.flatMap(command =>
        Effect.provideService(commands_[command.name], SubCommandContext, {
          command,
        }),
      ),
    ) as any
  }

  get optionsMap(): HashMap<string, string | undefined> {
    return Helpers.optionsMap(this.data)
  }
}

export type CommandHandlerFn<R, E, A> = (
  i: CommandHelper<A>,
) => Effect.Effect<Discord.InteractionResponse, E, R>

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
  : Options[Discord.ApplicationCommandType.CHAT_INPUT]

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
