import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as H from "@effect-ts/core/Effect/Hub"
import * as R from "@effect-ts/core/Effect/Ref"
import { flow, pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import {
  GatewayEvent,
  GatewayEvents,
  GatewayOpcode,
  GatewayPayload,
} from "../types"
import { memoize } from "../Utils/memoize"

export const opCode =
  (hub: H.Hub<GatewayPayload>) =>
  <T = any>(code: GatewayOpcode): S.UIO<GatewayPayload<T>> =>
    pipe(
      S.fromHub_(hub),
      S.filter((p) => p.op === code)
    )

export const latest = <T>(f: (p: GatewayPayload) => O.Option<T>) =>
  T.gen(function* (_) {
    const ref = yield* _(R.makeRef<O.Option<T>>(O.none))

    return [
      ref,
      S.tap(
        flow(
          f,
          O.fold(
            () => T.unit,
            (a) => R.set_(ref, O.some(a))
          )
        )
      ),
    ] as const
  })

export const fromDispatch = (hub: H.Hub<GatewayPayload<GatewayEvent>>) => {
  return memoize(<K extends keyof GatewayEvents>(event: K) =>
    pipe(
      H.filterOutput_(hub, (p) => p.t === event),
      H.map((p) => p.d as GatewayEvents[K])
    )
  )
}
