import * as D from "./definitions.js"

export const splitDefinitions = <R, E, TE>(
  definitions: Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect<any, any, any>) => Effect<R, TE, void>,
    ]
  >,
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
        readonly [
          Extract<D.InteractionDefinition<R, E>, { _tag: K }>,
          (self: Effect<any, any, any>) => Effect<R, TE, void>,
        ]
      >
    },
    (acc, [d, t]) => ({
      ...acc,
      [d._tag]: (acc[d._tag] as Chunk<any>).append([d, t]),
    }),
  )

  const Commands = grouped.GlobalApplicationCommand.concat(
    grouped.GuildApplicationCommand,
  ).reduce(
    {} as Record<
      string,
      readonly [
        D.GlobalApplicationCommand<R, E> | D.GuildApplicationCommand<R, E>,
        (self: Effect<any, any, any>) => Effect<R, TE, void>,
      ]
    >,
    (acc, [d, t]) =>
      ({
        ...acc,
        [d.command.name]: [d, t],
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
