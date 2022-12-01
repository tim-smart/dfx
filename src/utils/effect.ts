export type Success<A extends Effect<any, any, any>> = A extends Effect<
  any,
  any,
  infer R
>
  ? R
  : never
