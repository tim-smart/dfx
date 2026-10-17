import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import * as DiscordWS from "../DiscordWS.ts"
import * as SendEvents from "./sendEvents.ts"
import type * as Discord from "../../types.ts"
import * as EffectU from "../../utils/Effect.ts"
import * as Queue from "effect/Queue"

const payloadOrReconnect = (
  ref: Ref.Ref<boolean>,
  sequence: Effect.Effect<number | null>,
) =>
  Effect.flatMap(Ref.get(ref), (acked): Effect.Effect<DiscordWS.MessageSend> =>
    acked
      ? Effect.map(sequence, SendEvents.heartbeat)
      : Effect.succeed(DiscordWS.Reconnect),
  )

/**
 * `sequence` is the last sequence received, which can be ahead of the one
 * stored for RESUME.
 */
export const send = (
  hellos: Queue.Dequeue<Discord.GatewayHelloData>,
  acks: Queue.Dequeue<void>,
  sequence: Effect.Effect<number | null>,
  sendMessage: (p: DiscordWS.MessageSend) => Effect.Effect<void>,
) =>
  Effect.flatMap(Ref.make(true), ackedRef => {
    const sendPayload = payloadOrReconnect(ackedRef, sequence).pipe(
      Effect.tap(Ref.set(ackedRef, false)),
      Effect.flatMap(sendMessage),
    )

    const heartbeats = EffectU.foreverSwitch(
      Effect.tap(Queue.take(hellos), Ref.set(ackedRef, true)),
      Effect.fnUntraced(function* (p) {
        yield* Effect.sleep(p.heartbeat_interval * Math.random())
        while (true) {
          yield* sendPayload
          yield* Effect.sleep(p.heartbeat_interval)
        }
      }),
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
