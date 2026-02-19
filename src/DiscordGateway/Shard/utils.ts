import type * as Discord from "../../types.ts"
import * as Stream from "effect/Stream"

export const opCode =
  <R, E>(source: Stream.Stream<Discord.GatewayReceivePayload, E, R>) =>
  <const Code extends Discord.GatewayOpcodes>(
    code: Code,
  ): Stream.Stream<
    Extract<Discord.GatewayReceivePayload, { readonly op: Code }>,
    E,
    R
  > =>
    Stream.filter(source, p => p.op === code) as any
