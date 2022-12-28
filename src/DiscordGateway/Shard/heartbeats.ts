import * as SendEvents from "./sendEvents.js"
import * as Utils from "./utils.js"
import { millis } from "@fp-ts/data/Duration"

const send = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  seqRef.get
    .map((a) => SendEvents.heartbeat(a.getOrNull))
    .tap(() => ref.set(false))

const maybeSend = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  ref.get.flatMap(
    (acked): Effect<never, never, DiscordWS.Message> =>
      acked ? send(ref, seqRef) : Effect.succeed(WS.Reconnect),
  )

export const fromRaw = <R, E>(
  source: Stream<R, E, Discord.GatewayPayload>,
  seqRef: Ref<Maybe<number>>,
) =>
  pipe(
    Ref.make(true).map((ackedRef) => {
      const heartbeats = pipe(
        Utils.opCode(source)<Discord.HelloEvent>(
          Discord.GatewayOpcode.HELLO,
        ).tap(() => ackedRef.set(true)),
        Stream.flatMapParSwitch(1)((p) =>
          Stream.fromSchedule(
            Schedule.duration(
              millis(p.d!.heartbeat_interval * Math.random()),
            ).andThen(Schedule.spaced(millis(p.d!.heartbeat_interval))),
          ),
        ),
      ).mapEffect(() => maybeSend(ackedRef, seqRef))

      const acks = Utils.opCode(source)(
        Discord.GatewayOpcode.HEARTBEAT_ACK,
      ).tap(() => ackedRef.set(true)).drain

      return heartbeats.merge(acks)
    }),
    Stream.unwrap,
  )
