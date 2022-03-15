import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as H from "@effect-ts/core/Effect/Hub"
import * as R from "@effect-ts/core/Effect/Ref"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import * as DWS from "../DiscordWS"
import { GatewayOpcode, GatewayPayload, HelloEvent } from "../types"
import { Reconnect } from "../WS"
import * as Commands from "./commands"
import * as Utils from "./utils"

const send = (ref: R.Ref<boolean>, seqRef: R.Ref<O.Option<number>>) =>
  pipe(
    R.get(seqRef),
    T.map((o) => Commands.heartbeat(O.toNullable(o))),
    T.tap(() => R.set_(ref, false))
  )

const maybeSend = (ref: R.Ref<boolean>, seqRef: R.Ref<O.Option<number>>) =>
  pipe(
    R.get(ref),
    T.chain(
      (acked): T.UIO<DWS.Message> =>
        acked ? send(ref, seqRef) : T.succeed(Reconnect)
    )
  )

export const fromHub = (
  hub: H.Hub<GatewayPayload>,
  seqRef: R.Ref<O.Option<number>>
) =>
  pipe(
    R.makeRef(true),

    T.map((ackedRef) => {
      const heartbeats = pipe(
        Utils.opCode(hub)<HelloEvent>(GatewayOpcode.HELLO),

        // Reset ack state for each hello
        S.tap(() => R.set_(ackedRef, true)),

        S.chainParSwitch((p) => {
          const initial = p.d!.heartbeat_interval * Math.random()
          return S.merge_(
            // First random heartbeat
            S.fromEffect(T.sleep(initial)),
            // Repeated heartbeat
            pipe(
              S.fromEffect(T.sleep(initial)),
              S.chain(() => S.repeatEffect(T.sleep(p.d!.heartbeat_interval)))
            )
          )
        }, 1),

        // Map to gateway message depending on ack state
        S.mapEffect(() => maybeSend(ackedRef, seqRef))
      )

      const acks = pipe(
        Utils.opCode(hub)(GatewayOpcode.HEARTBEAT_ACK),
        S.tap(() => R.set_(ackedRef, true)),
        S.drain
      )

      return S.merge_(heartbeats, acks)
    }),

    S.unwrap
  )
