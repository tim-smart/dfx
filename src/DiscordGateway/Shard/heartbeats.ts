import * as Duration from "effect/Duration"
import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"
import * as DiscordWS from "../DiscordWS.ts"
import * as SendEvents from "./sendEvents.ts"
import type * as Discord from "../../types.ts"
import * as EffectU from "../../utils/Effect.ts"
import type { ShardState } from "./StateStore.ts"
import * as Queue from "effect/Queue"

const payload = (state: Effect.Effect<Option.Option<ShardState>>) =>
  Effect.map(state, state =>
    SendEvents.heartbeat(Option.getOrNull(Option.map(state, s => s.sequence))),
  )

const payloadOrReconnect = (
  ref: Ref.Ref<boolean>,
  state: Effect.Effect<Option.Option<ShardState>>,
) =>
  Effect.flatMap(
    Ref.get(ref),
    (acked): Effect.Effect<DiscordWS.MessageSend> =>
      acked ? payload(state) : Effect.succeed(DiscordWS.Reconnect),
  )

export const send = (
  hellos: Queue.Dequeue<Discord.GatewayHelloData>,
  acks: Queue.Dequeue<void>,
  state: Effect.Effect<Option.Option<ShardState>>,
  send: (p: DiscordWS.MessageSend) => Effect.Effect<void>,
) =>
  Effect.flatMap(Ref.make(true), ackedRef => {
    const sendPayload = payloadOrReconnect(ackedRef, state).pipe(
      Effect.tap(Ref.set(ackedRef, false)),
      Effect.flatMap(send),
    )

    const heartbeats = EffectU.foreverSwitch(
      Effect.tap(Queue.take(hellos), Ref.set(ackedRef, true)),
      p =>
        Effect.schedule(
          sendPayload,
          Schedule.andThen(
            Schedule.duration(
              Duration.millis(p.heartbeat_interval * Math.random()),
            ),
            Schedule.spaced(Duration.millis(p.heartbeat_interval)),
          ),
        ),
    )

    const run = Queue.take(acks).pipe(
      Effect.tap(Ref.set(ackedRef, true)),
      Effect.forever,
    )

    return Effect.all([run, heartbeats], {
      concurrency: "unbounded",
      discard: true,
    })
  })
