import { filter, tap } from "callbag-effect-ts/Source"
import { none, Option } from "@fp-ts/data/Option"

export const opCode =
  <R, E>(source: EffectSource<R, E, Discord.GatewayPayload>) =>
  <T = any>(code: Discord.GatewayOpcode) =>
    pipe(
      source,
      filter((p): p is Discord.GatewayPayload<T> => p.op === code),
    )

const maybeUpdateRef = <T>(
  f: (p: Discord.GatewayPayload) => Option<T>,
  ref: Ref<Option<T>>,
) => flow(f, (o) => o.match(Effect.unit, (a) => ref.set(Option.some(a))))

export const latest = <T>(f: (p: Discord.GatewayPayload) => Option<T>) =>
  Ref.make<Option<T>>(none).map((ref) => [ref, maybeUpdateRef(f, ref)] as const)
