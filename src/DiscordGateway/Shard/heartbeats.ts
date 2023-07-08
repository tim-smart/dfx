import { millis } from "@effect/data/Duration"
import * as SendEvents from "./sendEvents.js"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import { Reconnect } from "../WS.js"

const payload = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  seqRef.get
    .map(a => SendEvents.heartbeat(a.getOrNull))
    .tap(() => ref.set(false))

const payloadOrReconnect = (ref: Ref<boolean>, seqRef: Ref<Maybe<number>>) =>
  ref.get.flatMap(
    (acked): Effect<never, never, DiscordWS.Message> =>
      acked ? payload(ref, seqRef) : Effect.succeed(Reconnect),
  )

export const send = (
  hellos: Dequeue<Discord.GatewayPayload>,
  acks: Dequeue<Discord.GatewayPayload>,
  seqRef: Ref<Maybe<number>>,
  send: (p: DiscordWS.Message) => Effect<never, never, boolean>,
) =>
  Do($ => {
    const ackedRef = $(Ref.make(true))

    const heartbeats = hellos
      .take()
      .tap(() => ackedRef.set(true))
      .foreverSwitch(p =>
        payloadOrReconnect(ackedRef, seqRef)
          .tap(send)
          .schedule(
            Schedule.duration(
              millis(p.d!.heartbeat_interval * Math.random()),
            ).andThen(Schedule.fixed(millis(p.d!.heartbeat_interval))),
          ),
      )

    const run = acks.take().tap(() => ackedRef.set(true)).forever

    return $(
      Effect.all(run, heartbeats, {
        concurrency: "unbounded",
        discard: true,
      }),
    )
  })
