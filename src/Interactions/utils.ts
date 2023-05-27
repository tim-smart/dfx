import * as D from "./definitions.js"
import * as Ctx from "./context.js"

export type DefinitionFlattened<R, E, TE, A> = D.InteractionDefinition<
  R,
  E
> extends infer D
  ? {
      [K in keyof D]: K extends "handle"
        ? (_: Discord.Interaction) => Effect<R, TE, A>
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
  definitions: Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect<R, E, A>) => Effect<R, TE, B>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect<R, E, A>,
) =>
  definitions.map(([definition, transform]) => ({
    ...definition,
    handle: (i: Discord.Interaction) =>
      Effect.isEffect(definition.handle)
        ? transform(definition.handle.flatMap(_ => handleResponse(i, _)))
        : transform(
            definition.handle(context).flatMap(_ => handleResponse(i, _)),
          ),
  }))

export const splitDefinitions = <R, E, TE, A>(
  definitions: Chunk<DefinitionFlattened<R, E, TE, A>>,
) => {
  const grouped = definitions.reduce(
    {
      Autocomplete: Chunk.empty(),
      GlobalApplicationCommand: Chunk.empty(),
      GuildApplicationCommand: Chunk.empty(),
      MessageComponent: Chunk.empty(),
      ModalSubmit: Chunk.empty(),
    } as {
      [K in D.InteractionDefinition<R, E>["_tag"]]: Chunk<
        Extract<DefinitionFlattened<R, E, TE, A>, { _tag: K }>
      >
    },
    (acc, d) => ({
      ...acc,
      [d._tag]: (acc[d._tag] as Chunk<any>).append(d),
    }),
  )

  const Commands = grouped.GlobalApplicationCommand.concat(
    grouped.GuildApplicationCommand,
  ).reduce(
    {} as Record<string, DefinitionFlattenedCommand<R, E, TE, A>>,
    (acc, d) =>
      ({
        ...acc,
        [d.command.name]: d,
      } as any),
  )

  return {
    ...grouped,
    Commands,
  }
}
