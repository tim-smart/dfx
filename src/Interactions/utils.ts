import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Ctx from "dfx/Interactions/context"
import type * as D from "dfx/Interactions/definitions"
import type * as Discord from "dfx/types"

export type DefinitionFlattened<R, E, TE, A> =
  D.InteractionDefinition<R, E> extends infer D
    ? {
        [K in keyof D]: K extends "handle"
          ? (_: Discord.Interaction) => Effect.Effect<A, TE, R>
          : D[K]
      }
    : never

export type DefinitionFlattenedCommand<R, E, TE, A> = Extract<
  DefinitionFlattened<R, E, TE, A>,
  { _tag: "GlobalApplicationCommand" | "GuildApplicationCommand" }
>

const context: D.CommandHelper<any> = {
  resolve: Ctx.resolved,
  option: Ctx.option,
  optionValue: Ctx.optionValue,
  optionValueOptional: Ctx.optionValueOptional,
  subCommands: Ctx.handleSubCommands,
} as any

export const flattenDefinitions = <R, E, TE, A, B>(
  definitions: Chunk.Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect.Effect<A, E, R>) => Effect.Effect<B, TE, R>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect.Effect<A, E, R>,
) =>
  Chunk.map(definitions, ([definition, transform]) => ({
    ...definition,
    handle: (i: Discord.Interaction) =>
      Effect.isEffect(definition.handle)
        ? transform(
            Effect.flatMap(definition.handle, _ => handleResponse(i, _)),
          )
        : transform(
            Effect.flatMap(definition.handle(context), _ =>
              handleResponse(i, _),
            ),
          ),
  }))

export const splitDefinitions = <R, E, TE, A>(
  definitions: Chunk.Chunk<DefinitionFlattened<R, E, TE, A>>,
) => {
  const grouped = Chunk.reduce(
    definitions,
    {
      Autocomplete: Chunk.empty(),
      GlobalApplicationCommand: Chunk.empty(),
      GuildApplicationCommand: Chunk.empty(),
      MessageComponent: Chunk.empty(),
      ModalSubmit: Chunk.empty(),
    } as {
      [K in D.InteractionDefinition<R, E>["_tag"]]: Chunk.Chunk<
        Extract<DefinitionFlattened<R, E, TE, A>, { _tag: K }>
      >
    },
    (acc, d) => ({
      ...acc,
      [d._tag]: Chunk.append(acc[d._tag] as Chunk.Chunk<any>, d),
    }),
  )

  const Commands = Chunk.appendAll(
    grouped.GlobalApplicationCommand,
    grouped.GuildApplicationCommand,
  ).pipe(
    Chunk.reduce(
      {} as Record<string, DefinitionFlattenedCommand<R, E, TE, A>>,
      (acc, d) =>
        (({
          ...acc,
          [d.command.name]: d
        }) as any),
    ),
  )

  return {
    ...grouped,
    Commands,
  }
}
