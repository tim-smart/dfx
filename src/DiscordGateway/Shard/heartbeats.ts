import { millis } from "@effect/data/Duration"
import * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"
import * as Queue from "@effect/io/Queue"
import * as Ref from "@effect/io/Ref"
import * as Schedule from "@effect/io/Schedule"
import type * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import * as SendEvents from "dfx/DiscordGateway/Shard/sendEvents"
import { Reconnect } from "dfx/DiscordGateway/WS"
import type * as Discord from "dfx/types"
import * as EffectU from "dfx/utils/Effect"

const payload = (
  ref: Ref.Ref<boolean>,
  seqRef: Ref.Ref<Option.Option<number>>,
) =>
  Ref.get(seqRef).pipe(
    Effect.map(o => SendEvents.heartbeat(Option.getOrNull(o))),
    Effect.tap(() => Ref.set(ref, false)),
  )

const payloadOrReconnect = (
  ref: Ref.Ref<boolean>,
  seqRef: Ref.Ref<Option.Option<number>>,
) =>
  Effect.flatMap(
    Ref.get(ref),
    (acked): Effect.Effect<never, never, DiscordWS.Message> =>
      acked ? payload(ref, seqRef) : Effect.succeed(Reconnect),
  )

export const send = (
  hellos: Queue.Dequeue<Discord.GatewayPayload>,
  acks: Queue.Dequeue<Discord.GatewayPayload>,
  seqRef: Ref.Ref<Option.Option<number>>,
  send: (p: DiscordWS.Message) => Effect.Effect<never, never, boolean>,
) =>
  Effect.gen(function*(_) {
    const ackedRef = yield* _(Ref.make(true))

    const heartbeats = EffectU.foreverSwitch(
      Queue.take(hellos).pipe(Effect.tap(() => Ref.set(ackedRef, true))),
      p =>
        payloadOrReconnect(ackedRef, seqRef).pipe(
          Effect.tap(send),
          Effect.schedule(
            Schedule.duration(
              millis(p.d!.heartbeat_interval * Math.random()),
            ).pipe(
              Schedule.andThen(Schedule.fixed(millis(p.d!.heartbeat_interval))),
            ),
          ),
        ),
    )

    const run = Queue.take(acks).pipe(
      Effect.tap(() => Ref.set(ackedRef, true)),
      Effect.forever,
    )

    return yield* _(
      Effect.all([run, heartbeats], {
        concurrency: "unbounded",
        discard: true,
      }),
    )
  })
