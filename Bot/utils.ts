import { pipe } from "@effect-ts/core/Function"
import * as CB from "callbag-effect-ts"
import { GatewayEvent, GatewayEvents, GatewayPayload } from "../types"
import { memoize } from "../Utils/memoize"

export const fromDispatch = <R, E>(
  source: CB.EffectSource<R, E, GatewayPayload<GatewayEvent>>,
): (<K extends keyof GatewayEvents>(
  event: K,
) => CB.EffectSource<R, E, GatewayEvents[K]>) =>
  memoize((event) =>
    pipe(
      CB.filter_(source, (p) => p.t === event),
      CB.map((p) => p.d as any),
      CB.share,
    ),
  )
