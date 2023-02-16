import { millis } from "@effect/data/Duration"
import * as SendEvents from "./sendEvents.js"

const payload = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  seqRef.get
    .map(a => SendEvents.heartbeat(a.getOrNull))
    .tap(() => ref.set(false))

const payloadOrReconnect = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  ref.get.flatMap(
    (acked): Effect<never, never, DiscordWS.Message> =>
      acked ? payload(ref, seqRef) : Effect.succeed(WS.Reconnect),
  )

export const send = (
  hellos: Dequeue<Discord.GatewayPayload>,
  acks: Dequeue<Discord.GatewayPayload>,
  seqRef: Ref<Maybe<number>>,
  send: (p: DiscordWS.Message) => Effect<never, never, boolean>,
) =>
  Do($ => {
    const ackedRef = $(Ref.make(true))

    const heartbeats = Stream.fromQueue(hellos)
      .tap(() => ackedRef.set(true))
      .flatMapParSwitch(
        p =>
          Stream.fromSchedule(
            Schedule.duration(
              millis(p.d!.heartbeat_interval * Math.random()),
            ).andThen(Schedule.spaced(millis(p.d!.heartbeat_interval))),
          ),
        1,
      )
      .mapEffect(() => payloadOrReconnect(ackedRef, seqRef))
      .tap(send)

    const run = acks.take().tap(() => ackedRef.set(true)).forever

    return $(run.zipParLeft(heartbeats.runDrain))
  })
