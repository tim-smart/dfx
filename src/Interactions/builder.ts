import * as Chunk from "effect/Chunk"
import { identity } from "effect/Function"
import type * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"
import { catchTag } from "effect/Effect"
import * as Http from "@effect/platform/HttpClient"
import { DiscordREST, type DiscordRESTError } from "dfx/DiscordREST"
import type * as D from "dfx/Interactions/definitions"
import type * as Discord from "dfx/types"

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
    readonly definitions: Chunk.Chunk<
      readonly [
        handler: D.InteractionDefinition<R, E>,
        transform: (
          self: Effect.Effect<any, any, any>,
        ) => Effect.Effect<void, TE, R>,
      ]
    >,
    readonly transform: (
      self: Effect.Effect<any, any, any>,
    ) => Effect.Effect<void, TE, R>,
  ) {}

  add<R1, E1>(definition: D.InteractionDefinition<R1, E1>) {
    return new InteractionBuilder<R | R1, E | E1, TE | E1>(
      Chunk.append(this.definitions, [definition, this.transform] as const),
      this.transform,
    )
  }

  concat<R1, E1, TE1>(builder: InteractionBuilder<R1, E1, TE1>) {
    return new InteractionBuilder<R | R1, E | E1, TE | TE1>(
      Chunk.appendAll(this.definitions, builder.definitions),
      this.transform,
    )
  }

  private transformTransform<R1, E1>(
    f: (selr: Effect.Effect<void, TE, R>) => Effect.Effect<void, E1, R1>,
  ) {
    return new InteractionBuilder<R1, E, E1>(
      Chunk.map(this.definitions, ([d, t]) => [d as any, _ => f(t(_)) as any]),
      _ => f(this.transform(_)) as any,
    )
  }

  private transformHandlers<R1, E1>(
    f: (
      self: Effect.Effect<Discord.InteractionResponse, E, R>,
    ) => Effect.Effect<Discord.InteractionResponse, E1, R1>,
  ) {
    return new InteractionBuilder<
      R1,
      E1,
      Exclude<TE, Exclude<E, E1>> | Exclude<E1, E>
    >(
      Chunk.map(this.definitions, ([d, t]) => [
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

  catchAllCause<R1, E1>(
    f: (cause: Cause.Cause<TE>) => Effect.Effect<void, E1, R1>,
  ) {
    return this.transformTransform<R | R1, E1>(Effect.catchAllCause(f))
  }

  catchAllCauseRespond<R1, E1>(
    f: (
      cause: Cause.Cause<E>,
    ) => Effect.Effect<Discord.InteractionResponse, E1, R1>,
  ) {
    return this.transformHandlers<R | R1, E1>(Effect.catchAllCause(f))
  }

  catchAll<R1, E1>(f: (error: TE) => Effect.Effect<void, E1, R1>) {
    return this.transformTransform<R | R1, E1>(Effect.catchAll(f))
  }

  catchAllRespond<R1, E1>(
    f: (error: E) => Effect.Effect<Discord.InteractionResponse, E1, R1>,
  ) {
    return this.transformHandlers<R | R1, E1>(Effect.catchAll(f))
  }

  catchTag<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (error: Extract<TE, { _tag: T }>) => Effect.Effect<void, E1, R1>,
  ) {
    return this.transformTransform<R | R1, Exclude<TE, { _tag: T }> | E1>(
      _ => catchTag(_ as any, tag, f as any) as any,
    )
  }

  catchTagRespond<T extends ExtractTag<E>, R1, E1>(
    tag: T,
    f: (
      error: Extract<E, { _tag: T }>,
    ) => Effect.Effect<Discord.InteractionResponse, E1, R1>,
  ) {
    return this.transformHandlers<R | R1, Exclude<E, { _tag: T }> | E1>(
      _ => catchTag(_ as any, tag, f as any) as any,
    )
  }

  get syncGlobal() {
    const commands = this.definitions.pipe(
      Chunk.map(([d, _]) => d),
      Chunk.filter(
        (c): c is D.GlobalApplicationCommand<R, E> =>
          c._tag === "GlobalApplicationCommand",
      ),
      Chunk.map(c => c.command),
    )

    return Effect.flatMap(DiscordREST, rest =>
      rest.getCurrentBotApplicationInformation().pipe(
        Effect.flatMap(r => r.json),
        Effect.flatMap(app =>
          rest.bulkOverwriteGlobalApplicationCommands(app.id, {
            body: Http.body.unsafeJson(Chunk.toReadonlyArray(commands)),
          }),
        ),
      ),
    )
  }

  syncGuild(appId: Discord.Snowflake, guildId: Discord.Snowflake) {
    const commands = this.definitions.pipe(
      Chunk.map(([d, _]) => d),
      Chunk.filter(
        (c): c is D.GuildApplicationCommand<R, E> =>
          c._tag === "GuildApplicationCommand",
      ),
      Chunk.map(c => c.command),
    )

    return Effect.flatMap(DiscordREST, rest =>
      rest.bulkOverwriteGuildApplicationCommands(
        appId,
        guildId,
        Chunk.toReadonlyArray(commands) as any,
      ),
    )
  }
}

export const builder = new InteractionBuilder<never, never, DiscordRESTError>(
  Chunk.empty(),
  identity as any,
)
