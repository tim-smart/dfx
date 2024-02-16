import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import * as Stream from "effect/Stream"
import type * as Discord from "dfx/types"

export const opCode =
  <R, E>(source: Stream.Stream<Discord.GatewayPayload, E, R>) =>
  <T = any>(
    code: Discord.GatewayOpcode,
  ): Stream.Stream<Discord.GatewayPayload<T>, E, R> =>
    source.pipe(
      Stream.filter((p): p is Discord.GatewayPayload<T> => p.op === code),
    )

const maybeUpdateRef =
  <T>(
    f: (p: Discord.GatewayPayload) => Option.Option<T>,
    ref: Ref.Ref<Option.Option<T>>,
  ) =>
  (_: Discord.GatewayPayload): Effect.Effect<void> =>
    Option.match(f(_), {
      onNone: () => Effect.unit,
      onSome: a => Ref.set(ref, Option.some(a)),
    })

export const latest = <T>(
  f: (p: Discord.GatewayPayload) => Option.Option<T>,
): Effect.Effect<
  readonly [
    Ref.Ref<Option.Option<T>>,
    (_: Discord.GatewayPayload<any>) => Effect.Effect<void>,
  ]
> =>
  Effect.map(
    Ref.make<Option.Option<T>>(Option.none()),
    ref => [ref, maybeUpdateRef(f, ref)] as const,
  )
