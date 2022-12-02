import { fromSchedule, unwrap } from "callbag-effect-ts/Source"
import { millis } from "@fp-ts/data/Duration"
import * as SendEvents from "./sendEvents.js"
import * as Utils from "./utils.js"

const send = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  seqRef.get
    .map((a) => SendEvents.heartbeat(a.getOrNull))
    .tap(() => ref.set(false))

const maybeSend = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  ref.get.flatMap(
    (acked): Effect<never, never, DWS.Message> =>
      acked ? send(ref, seqRef) : Effect.succeed(WS.Reconnect),
  )

export const fromRaw = <R, E>(
  source: EffectSource<R, E, Discord.GatewayPayload>,
  seqRef: Ref<Maybe<number>>,
) =>
  pipe(
    Ref.make(true).map((ackedRef) => {
      const heartbeats = Utils.opCode(source)<Discord.HelloEvent>(
        Discord.GatewayOpcode.HELLO,
      )
        .tap(() => ackedRef.set(true))
        .switchMap((p) =>
          fromSchedule(
            Schedule.duration(
              millis(p.d!.heartbeat_interval * Math.random()),
            ).andThen(Schedule.spaced(millis(p.d!.heartbeat_interval))),
          ),
        )
        .mapEffect(() => maybeSend(ackedRef, seqRef))

      const acks = Utils.opCode(source)(
        Discord.GatewayOpcode.HEARTBEAT_ACK,
      ).tap(() => ackedRef.set(true)).drain

      return heartbeats.merge(acks)
    }),
    unwrap,
  )
