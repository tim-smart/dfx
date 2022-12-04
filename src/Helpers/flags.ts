export type Flags<T extends number | bigint> = Record<string, T>

/**
 * Returns all the flags OR'ed together.
 */
export function all(flags: Flags<number>): number
export function all(flags: Flags<bigint>): bigint
export function all(flags: Flags<any>): any {
  return Object.values(flags).reduce((acc, flag) => acc | flag)
}

/**
 * Returns a function that converts a bitfield to a list of flag names.
 */
export function toList<T extends Flags<number>>(
  flags: T,
): (bitfield: number) => (keyof T)[]
export function toList<T extends Flags<bigint>>(
  flags: T,
): (bitfield: bigint) => (keyof T)[]
export function toList<T extends Flags<any>>(
  flags: T,
): (bitfield: any) => (keyof T)[] {
  const entries = Object.entries(flags)
  return (val) =>
    entries.reduce(
      (acc, [key, flag]) => ((val & flag) === flag ? [...acc, key] : acc),
      [] as (keyof T)[],
    )
}

/**
 * Returns a function that converts a list of flags names to a bigint bitfield.
 */
export const fromListBigint =
  <T extends Flags<bigint>>(flags: T) =>
  (list: (keyof T)[]) =>
    list.reduce((acc, key) => acc | flags[key], BigInt(0))

/**
 * Returns a function that converts a list of flags names to a bitfield.
 */
export const fromList =
  <T extends Flags<number>>(flags: T) =>
  (list: (keyof T)[]) =>
    list.reduce((acc, key) => acc | flags[key], 0)

/**
 * Checks if a bigint bitfield contains and a flag value.
 */
export const hasBigInt = (flag: bigint | string) => {
  const flagBigInt = BigInt(flag)
  return (bits: bigint | string) => {
    const bitsBigInt = BigInt(bits)
    return (bitsBigInt & flagBigInt) === flagBigInt
  }
}

/**
 * Checks if a bitfield contains and a flag value.
 */
export const has = (flag: number | string) => {
  const flagNumber = +flag
  return (bits: number | string) => {
    const bitsNumber = +bits
    return (bitsNumber & flagNumber) === flagNumber
  }
}
