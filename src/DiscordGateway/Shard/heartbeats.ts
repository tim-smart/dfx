import * as Duration from "effect/Duration"
import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Queue from "effect/Queue"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import * as SendEvents from "dfx/DiscordGateway/Shard/sendEvents"
import type * as Discord from "dfx/types"
import * as EffectU from "dfx/utils/Effect"

const payload = (seqRef: Ref.Ref<Option.Option<number>>) =>
  Effect.map(Ref.get(seqRef), seq =>
    SendEvents.heartbeat(Option.getOrNull(seq)),
  )

const payloadOrReconnect = (
  ref: Ref.Ref<boolean>,
  seqRef: Ref.Ref<Option.Option<number>>,
) =>
  Effect.flatMap(
    Ref.get(ref),
    (acked): Effect.Effect<DiscordWS.Message> =>
      acked ? payload(seqRef) : Effect.succeed(DiscordWS.Reconnect),
  )

export const send = (
  hellos: Queue.Dequeue<Discord.GatewayPayload>,
  acks: Queue.Dequeue<Discord.GatewayPayload>,
  seqRef: Ref.Ref<Option.Option<number>>,
  send: (p: DiscordWS.Message) => Effect.Effect<boolean>,
) =>
  Effect.flatMap(Ref.make(true), ackedRef => {
    const heartbeats = EffectU.foreverSwitch(
      Effect.zipLeft(Queue.take(hellos), Ref.set(ackedRef, true)),
      p =>
        payloadOrReconnect(ackedRef, seqRef).pipe(
          Effect.zipLeft(Ref.set(ackedRef, false)),
          Effect.tap(send),
          Effect.schedule(
            Schedule.andThen(
              Schedule.duration(
                Duration.millis(p.d!.heartbeat_interval * Math.random()),
              ),
              Schedule.spaced(Duration.millis(p.d!.heartbeat_interval)),
            ),
          ),
        ),
    )

    const run = Queue.take(acks).pipe(
      Effect.zipLeft(Ref.set(ackedRef, true)),
      Effect.forever,
    )

    return Effect.all([run, heartbeats], {
      concurrency: "unbounded",
      discard: true,
    })
  })
