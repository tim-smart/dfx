import * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"
import * as Ref from "@effect/io/Ref"
import * as Stream from "@effect/stream/Stream"
import type * as Discord from "dfx/types"

export const opCode =
  <R, E>(source: Stream.Stream<R, E, Discord.GatewayPayload>) =>
  <T = any>(
    code: Discord.GatewayOpcode,
  ): Stream.Stream<R, E, Discord.GatewayPayload<T>> =>
    source.pipe(
      Stream.filter((p): p is Discord.GatewayPayload<T> => p.op === code),
    )

const maybeUpdateRef =
  <T>(
    f: (p: Discord.GatewayPayload) => Option.Option<T>,
    ref: Ref.Ref<Option.Option<T>>,
  ) =>
  (_: Discord.GatewayPayload): Effect.Effect<never, never, void> =>
    Option.match(f(_), {
      onNone: () => Effect.unit,
      onSome: a => Ref.set(ref, Option.some(a)),
    })

export const latest = <T>(
  f: (p: Discord.GatewayPayload) => Option.Option<T>,
): Effect.Effect<
  never,
  never,
  readonly [
    Ref.Ref<Option.Option<T>>,
    (_: Discord.GatewayPayload<any>) => Effect.Effect<never, never, void>,
  ]
> =>
  Effect.map(
    Ref.make<Option.Option<T>>(Option.none()),
    ref => [ref, maybeUpdateRef(f, ref)] as const,
  )
