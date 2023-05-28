import * as Http from "@effect-http/client"
import { catchTag } from "@effect/io/Effect"
import { DiscordREST } from "dfx"
import { Discord, Effect } from "dfx/_common"
import * as D from "./definitions.js"
import { DiscordRESTError } from "dfx/DiscordREST"

type ExtractTag<A> = A extends { _tag: infer Tag }
  ? Tag extends string
    ? Tag
    : never
  : never

/**
 * @tsplus type dfx/InteractionBuilder
 */
export class InteractionBuilder<R, E, TE> {
  constructor(
    readonly definitions: Chunk<
      readonly [
        handler: D.InteractionDefinition<R, E>,
        transform: (self: Effect<any, any, any>) => Effect<R, TE, void>,
      ]
    >,
    readonly transform: (self: Effect<any, any, any>) => Effect<R, TE, void>,
  ) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1, TE | E1>(
      this.definitions.append([definition, this.transform] as const),
      this.transform,
    )
  }

  concat<R1, E1, TE1>(builder: InteractionBuilder<R1, E1, TE1>) {
    return new InteractionBuilder<R | R1, E | E1, TE | TE1>(
      this.definitions.concat(builder.definitions),
      this.transform,
    )
  }

  private transformTransform<R1, E1>(
    f: (selr: Effect<R, TE, void>) => Effect<R1, E1, void>,
  ) {
    return new InteractionBuilder<R1, E, E1>(
      this.definitions.map(([d, t]) => [d as any, _ => f(t(_)) as any]),
      _ => f(this.transform(_)) as any,
    )
  }

  private transformHandlers<R1, E1>(
    f: (
      selr: Effect<R, E, Discord.InteractionResponse>,
    ) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return new InteractionBuilder<
      R1,
      E1,
      Exclude<TE, Exclude<E, E1>> | Exclude<E1, E>
    >(
      this.definitions.map(([d, t]) => [
        {
          ...d,
          handle: Effect.isEffect(d.handle)
            ? f(d.handle)
            : (_: any) => f((d.handle as any)(_)),
        } as any,
        t as any,
      ]),
      this.transform as any,
    )
  }

  catchAllCause<R1, E1>(f: (cause: Cause<TE>) => Effect<R1, E1, void>) {
    return this.transformTransform<R | R1, E1>(_ => _.catchAllCause(f))
  }

  catchAllCauseRespond<R1, E1>(
    f: (cause: Cause<E>) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return this.transformHandlers<R | R1, E1>(_ => _.catchAllCause(f))
  }

  catchAll<R1, E1>(f: (error: TE) => Effect<R1, E1, void>) {
    return this.transformTransform<R | R1, E1>(_ => _.catchAll(f))
  }

  catchAllRespond<R1, E1>(
    f: (error: E) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return this.transformHandlers<R | R1, E1>(_ => _.catchAll(f))
  }

  catchTag<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (error: Extract<TE, { _tag: T }>) => Effect<R1, E1, void>,
  ) {
    return this.transformTransform<R | R1, Exclude<TE, { _tag: T }> | E1>(
      _ => catchTag(_ as any, tag, f as any) as any,
    )
  }

  catchTagRespond<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (
      error: Extract<E, { _tag: T }>,
    ) => Effect<R1, E1, Discord.InteractionResponse>,
  ) {
    return this.transformHandlers<R | R1, Exclude<E, { _tag: T }> | E1>(
      _ => catchTag(_ as any, tag, f as any) as any,
    )
  }

  get syncGlobal() {
    const commands = this.definitions
      .map(([d, _]) => d)
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
            body: Http.body.json(commands.toReadonlyArray),
          }),
        ),
    )
  }

  syncGuild(appId: Discord.Snowflake, guildId: Discord.Snowflake) {
    const commands = this.definitions
      .map(([d, _]) => d)
      .filter(
        (c): c is D.GuildApplicationCommand<R, E> =>
          c._tag === "GuildApplicationCommand",
      )
      .map(c => c.command)

    return DiscordREST.flatMap(rest =>
      rest.bulkOverwriteGuildApplicationCommands(
        appId,
        guildId,
        commands.toReadonlyArray as any,
      ),
    )
  }
}

export const builder = new InteractionBuilder<never, never, DiscordRESTError>(
  Chunk.empty(),
  identity as any,
)
