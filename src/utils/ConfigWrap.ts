import { Config, ConfigTypeId } from "@effect/io/Config"

/**
 * Wraps a nested structure, converting all primitives to a `Config`.
 *
 * `Wrap<{ key: string }>` becomes `{ key: Config<string> }`
 *
 * @since 1.0.0
 * @category models
 */
export type Wrap<A> =
  | (A extends Record<string, any>
      ? {
          [K in keyof A]: Wrap<A[K]>
        }
      : never)
  | Config<A>

/**
 * Constructs a config from a `Wrap`ed value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unwrap = <A>(wrapped: Wrap<A>): Config<A> => {
  if (
    typeof wrapped === "object" &&
    wrapped != null &&
    ConfigTypeId in wrapped
  ) {
    return wrapped
  }

  return Config.struct(
    Object.fromEntries(Object.entries(wrapped).map(([k, a]) => [k, unwrap(a)])),
  ) as any
}
