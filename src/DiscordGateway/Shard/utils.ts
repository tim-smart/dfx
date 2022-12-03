export const opCode =
  <R, E>(source: EffectSource<R, E, Discord.GatewayPayload>) =>
  <T = any>(code: Discord.GatewayOpcode) =>
    source.filter((p): p is Discord.GatewayPayload<T> => p.op === code)

const maybeUpdateRef = <T>(
  f: (p: Discord.GatewayPayload) => Maybe<T>,
  ref: Ref<Maybe<T>>,
) => flow(f, (o) => o.match(Effect.unit, (a) => ref.set(Maybe.some(a))))

export const latest = <T>(f: (p: Discord.GatewayPayload) => Maybe<T>) =>
  Ref.make<Maybe<T>>(Maybe.none).map(
    (ref) => [ref, maybeUpdateRef(f, ref)] as const,
  )
