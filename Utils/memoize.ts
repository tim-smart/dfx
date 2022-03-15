type Primitive = string | number | boolean

export function memoize<A extends Primitive, T>(f: (a: A) => T) {
  const cache = new Map<A, T>()

  return (a: A): T => {
    if (cache.has(a)) {
      return cache.get(a) as T
    }

    const value = f(a)
    cache.set(a, value)
    return value
  }
}
