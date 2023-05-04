import * as Http from "@effect-http/client"
import { catchTag } from "@effect/io/Effect"
import { DiscordREST } from "dfx"
import { Discord, Effect } from "dfx/_common"
import * as D from "./definitions.js"

export { response } from "../Helpers/interactions.js"
export * from "./context.js"
export {
  InteractionDefinition,
  autocomplete,
  global,
  guild,
  messageComponent,
  modalSubmit,
} from "./definitions.js"

type ExtractTag<A> = A extends { _tag: infer Tag }
  ? Tag extends string
    ? Tag
    : never
  : never

/**
 * @tsplus type dfx/InteractionBuilder
 */
export class InteractionBuilder<R, E> {
  constructor(
    readonly definitions: D.InteractionDefinition<R, E>[],
    readonly transform: (self: Effect<any, any, any>) => Effect<R, E, void>,
    readonly transformRespond: (
      self: Effect<any, any, Discord.InteractionResponse>,
    ) => Effect<R, E, Discord.InteractionResponse>,
  ) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>(
      [...this.definitions, definition],
      this.transform,
      this.transformRespond,
    )
  }

  concat<R1, E1>(builder: InteractionBuilder<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1>(
      [...this.definitions, ...builder.definitions],
      this.transform,
      this.transformRespond,
    )
  }

  catchAllCause<R1, E1>(f: (cause: Cause<E>) => Effect<R1, E1, void>) {
    return new InteractionBuilder<R | R1, E1>(
      this.definitions as any,
      _ => this.transform(_).catchAllCause(f),
      this.transformRespond as any,
    )
  }

  catchAllCauseRespond<R1, E1>(
    f: (cause: Cause<E>) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return new InteractionBuilder<R | R1, E1>(
      this.definitions as any,
      this.transform as any,
      _ => this.transformRespond(_).catchAllCause(f),
    )
  }

  catchAll<R1, E1>(f: (error: E) => Effect<R1, E1, void>) {
    return new InteractionBuilder<R | R1, E1>(
      this.definitions as any,
      _ => this.transform(_).catchAll(f),
      this.transformRespond as any,
    )
  }

  catchAllRespond<R1, E1>(
    f: (error: E) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return new InteractionBuilder<R | R1, E1>(
      this.definitions as any,
      this.transform as any,
      _ => this.transformRespond(_).catchAll(f),
    )
  }

  catchTag<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (error: Extract<E, { _tag: T }>) => Effect<R1, E1, void>,
  ) {
    return new InteractionBuilder<R | R1, Exclude<E, { _tag: T }> | E1>(
      this.definitions as any,
      _ => catchTag(this.transform(_) as any, tag, f as any) as any,
      this.transformRespond as any,
    )
  }

  catchTagRespond<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (
      error: Extract<E, { _tag: T }>,
    ) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return new InteractionBuilder<R | R1, Exclude<E, { _tag: T }> | E1>(
      this.definitions as any,
      this.transform as any,
      _ => catchTag(this.transformRespond(_) as any, tag, f as any) as any,
    )
  }

  get syncGlobal() {
    const commands = this.definitions
      .filter(
        (c): c is D.GlobalApplicationCommand<R, E> =>
          c._tag === "GlobalApplicationCommand",
      )
      .map(c => c.command)

    return DiscordREST.flatMap(rest =>
      rest
        .getCurrentBotApplicationInformation()
        .flatMap(r => r.json)
        .flatMap(app =>
          rest.bulkOverwriteGlobalApplicationCommands(app.id, {
            body: Http.body.json(commands),
          }),
        ),
    )
  }

  syncGuild(appId: Discord.Snowflake, guildId: Discord.Snowflake) {
    const commands = this.definitions
      .filter(
        (c): c is D.GuildApplicationCommand<R, E> =>
          c._tag === "GuildApplicationCommand",
      )
      .map(c => c.command)

    return DiscordREST.flatMap(rest =>
      rest.bulkOverwriteGuildApplicationCommands(
        appId,
        guildId,
        commands as any,
      ),
    )
  }
}

export const builder = new InteractionBuilder<never, never>(
  [],
  identity as any,
  identity as any,
)

// Filters
export const id = (query: string) => (customId: string) =>
  Effect.succeed(query === customId)

export const idStartsWith = (query: string) => (customId: string) =>
  Effect.succeed(customId.startsWith(query))

export const idRegex = (query: RegExp) => (customId: string) =>
  Effect.succeed(query.test(customId))

export const option =
  (command: string, optionName: string) =>
  (
    data: Pick<Discord.ApplicationCommandDatum, "name">,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(data.name === command && focusedOption.name === optionName)

export const optionOnly =
  (optionName: string) =>
  (
    _: unknown,
    focusedOption: Pick<
      Discord.ApplicationCommandInteractionDataOption,
      "name"
    >,
  ) =>
    Effect.succeed(focusedOption.name === optionName)
