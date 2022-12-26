import {
  Discord,
  Duration,
  Effect,
  Option,
  pipe,
  Ref,
  Schedule,
  Stream,
} from "dfx/_common"
import * as DiscordWS from "../DiscordWS/index.js"
import * as WS from "../WS/index.js"
import * as SendEvents from "./sendEvents.js"
import * as Utils from "./utils.js"

const send = (ref: Ref.Ref<boolean>, seqRef: Ref.Ref<Option.Option<number>>) =>
  seqRef.get
    .map((a) => SendEvents.heartbeat(a.getOrNull))
    .tap(() => ref.set(false))

const maybeSend = (
  ref: Ref.Ref<boolean>,
  seqRef: Ref.Ref<Option.Option<number>>,
) =>
  ref.get.flatMap(
    (acked): Effect.Effect<never, never, DiscordWS.Message> =>
      acked ? send(ref, seqRef) : Effect.succeed(WS.Reconnect),
  )

export const fromRaw = <R, E>(
  source: Stream.Stream<R, E, Discord.GatewayPayload>,
  seqRef: Ref.Ref<Option.Option<number>>,
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
              Duration.millis(p.d!.heartbeat_interval * Math.random()),
            ).andThen(
              Schedule.spaced(Duration.millis(p.d!.heartbeat_interval)),
            ),
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
