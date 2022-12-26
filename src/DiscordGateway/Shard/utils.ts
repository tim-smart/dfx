import { Discord, Effect, flow, Option, Ref, Stream } from "dfx/_common"

export const opCode =
  <R, E>(source: Stream.Stream<R, E, Discord.GatewayPayload>) =>
  <T = any>(code: Discord.GatewayOpcode) =>
    source.filter((p): p is Discord.GatewayPayload<T> => p.op === code)

const maybeUpdateRef = <T>(
  f: (p: Discord.GatewayPayload) => Option.Option<T>,
  ref: Ref.Ref<Option.Option<T>>,
) => flow(f, (o) => o.match(Effect.unit, (a) => ref.set(Option.some(a))))

export const latest = <T>(f: (p: Discord.GatewayPayload) => Option.Option<T>) =>
  Ref.make<Option.Option<T>>(Option.none).map(
    (ref) => [ref, maybeUpdateRef(f, ref)] as const,
  )
