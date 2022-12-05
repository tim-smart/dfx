import * as D from "./definitions.js"

export const splitDefinitions = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
) => {
  const grouped = definitions.reduce<{
    [K in D.InteractionDefinition<R, E>["_tag"]]: Extract<
      D.InteractionDefinition<R, E>,
      { _tag: K }
    >[]
  }>(
    (acc, a) => ({
      ...acc,
      [a._tag]: [...(acc[a._tag] ?? []), a],
    }),
    {
      Autocomplete: [],
      GlobalApplicationCommand: [],
      GuildApplicationCommand: [],
      MessageComponent: [],
      ModalSubmit: [],
    },
  )

  const Commands = [
    ...grouped.GlobalApplicationCommand,
    ...grouped.GuildApplicationCommand,
  ].reduce(
    (acc, a) => ({
      ...acc,
      [a.command.name]: a,
    }),
    {} as Record<
      string,
      D.GlobalApplicationCommand<R, E> | D.GuildApplicationCommand<R, E>
    >,
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
