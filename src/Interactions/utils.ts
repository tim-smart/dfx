import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import type * as D from "./definitions.ts"
import type * as Discord from "../types.ts"
import * as Array from "effect/Array"
import { CommandHelper } from "./commandHelper.ts"

export type DefinitionFlattened<R, E, TE, A> =
  D.InteractionDefinition<R, E> extends infer D
    ? {
        [K in keyof D]: K extends "handle"
          ? (_: Discord.APIInteraction) => Effect.Effect<A, TE, R>
          : D[K]
      }
    : never

export type DefinitionFlattenedCommand<R, E, TE, A> = Extract<
  DefinitionFlattened<R, E, TE, A>,
  { _tag: "GlobalApplicationCommand" | "GuildApplicationCommand" }
>

export const flattenDefinitions = <R, E, TE, A, B>(
  definitions: Chunk.Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect.Effect<A, E, R>) => Effect.Effect<B, TE, R>,
    ]
  >,
  handleResponse: (
    ix: Discord.APIInteraction,
    _: Discord.CreateInteractionResponseRequest,
  ) => Effect.Effect<A, E, R>,
) =>
  Array.map(Chunk.toReadonlyArray(definitions), ([definition, transform]) => ({
    ...definition,
    handle: Effect.isEffect(definition.handle)
      ? (i: Discord.APIInteraction) =>
          Effect.scoped(
            transform(
              Effect.flatMap(
                definition.handle as Effect.Effect<Discord.CreateInteractionResponseRequest>,
                _ => handleResponse(i, _),
              ),
            ),
          )
      : (i: Discord.APIInteraction) =>
          Effect.scoped(
            transform(
              Effect.flatMap(
                (
                  definition.handle as (
                    _: any,
                  ) => Effect.Effect<Discord.CreateInteractionResponseRequest>
                )(new CommandHelper(i)),
                _ => handleResponse(i, _),
              ),
            ),
          ),
  }))

export const splitDefinitions = <R, E, TE, A>(
  definitions: ReadonlyArray<DefinitionFlattened<R, E, TE, A>>,
) => {
  const grouped = Array.reduce(
    definitions,
    {
      Autocomplete: [],
      GlobalApplicationCommand: [],
      GuildApplicationCommand: [],
      MessageComponent: [],
      ModalSubmit: [],
      Commands: {},
    } as {
      [K in D.InteractionDefinition<R, E>["_tag"]]: Array<
        Extract<DefinitionFlattened<R, E, TE, A>, { _tag: K }>
      >
    } & {
      readonly Commands: Record<string, DefinitionFlattenedCommand<R, E, TE, A>>
    },
    (acc, d) => {
      acc[d._tag].push(d as any)
      if (
        d._tag === "GlobalApplicationCommand" ||
        d._tag === "GuildApplicationCommand"
      ) {
        acc.Commands[d.command.name] = d as any
      }
      return acc
    },
  )

  return grouped
}
