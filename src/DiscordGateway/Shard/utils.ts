import type * as Discord from "dfx/types"
import * as Stream from "effect/Stream"

export const opCode =
  <R, E>(source: Stream.Stream<Discord.GatewayPayload, E, R>) =>
  <T = any>(
    code: Discord.GatewayOpcode,
  ): Stream.Stream<Discord.GatewayPayload<T>, E, R> =>
    source.pipe(
      Stream.filter((p): p is Discord.GatewayPayload<T> => p.op === code),
    )
