import * as T from "@effect-ts/core/Effect"
import * as R from "@effect-ts/core/Effect/Ref"
import * as SC from "@effect-ts/core/Effect/Schedule"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import * as CB from "callbag-effect-ts"
import * as DWS from "../DiscordWS"
import { GatewayOpcode, GatewayPayload, HelloEvent } from "../../types"
import { Reconnect } from "../WS"
import * as Commands from "./commands"
import * as Utils from "./utils"

const send = (ref: R.Ref<boolean>, seqRef: R.Ref<O.Option<number>>) =>
  pipe(
    R.get(seqRef),
    T.map((o) => Commands.heartbeat(O.toNullable(o))),
    T.tap(() => R.set_(ref, false)),
  )

const maybeSend = (ref: R.Ref<boolean>, seqRef: R.Ref<O.Option<number>>) =>
  pipe(
    R.get(ref),
    T.chain(
      (acked): T.UIO<DWS.Message> =>
        acked ? send(ref, seqRef) : T.succeed(Reconnect),
    ),
  )

export const fromRaw = <R, E>(
  source: CB.EffectSource<R, E, GatewayPayload>,
  seqRef: R.Ref<O.Option<number>>,
) =>
  pipe(
    R.makeRef(true),

    T.map((ackedRef) => {
      const heartbeats = pipe(
        Utils.opCode(source)<HelloEvent>(GatewayOpcode.HELLO),

        // Reset ack state for each hello
        CB.tap(() => R.set_(ackedRef, true)),

        CB.switchMap((p) =>
          CB.fromSchedule(
            SC.duration(p.d!.heartbeat_interval * Math.random())["++"](
              SC.spaced(p.d!.heartbeat_interval),
            ),
          ),
        ),

        // Map to gateway message depending on ack state
        CB.mapEffect(() => maybeSend(ackedRef, seqRef)),
      )

      const acks = pipe(
        Utils.opCode(source)(GatewayOpcode.HEARTBEAT_ACK),
        CB.tap(() => R.set_(ackedRef, true)),
        CB.drain,
      )

      return CB.merge_(heartbeats, acks)
    }),

    CB.unwrap,
  )
