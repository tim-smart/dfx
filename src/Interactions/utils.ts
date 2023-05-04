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
const MAP_HEX: Record<string, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
}

export function fromHex(hexString: string) {
  const bytes = new Uint8Array(Math.floor((hexString || "").length / 2))
  let i
  for (i = 0; i < bytes.length; i++) {
    const a = MAP_HEX[hexString[i * 2]]
    const b = MAP_HEX[hexString[i * 2 + 1]]
    if (a === undefined || b === undefined) {
      break
    }
    bytes[i] = (a << 4) | b
  }
  return i === bytes.length ? bytes : bytes.slice(0, i)
}
