import * as Duration from "effect/Duration"
import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import * as Schedule from "effect/Schedule"
import * as DiscordWS from "dfx/DiscordGateway/DiscordWS"
import * as SendEvents from "dfx/DiscordGateway/Shard/sendEvents"
import type * as Discord from "dfx/types"
import * as EffectU from "dfx/utils/Effect"
import type { ShardState } from "dfx/DiscordGateway/Shard/StateStore"
import type * as Mailbox from "effect/Mailbox"

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
    (acked): Effect.Effect<DiscordWS.Message> =>
      acked ? payload(state) : Effect.succeed(DiscordWS.Reconnect),
  )

export const send = (
  hellos: Mailbox.ReadonlyMailbox<Discord.GatewayPayload>,
  acks: Mailbox.ReadonlyMailbox<Discord.GatewayPayload>,
  state: Effect.Effect<Option.Option<ShardState>>,
  send: (p: DiscordWS.Message) => Effect.Effect<boolean>,
) =>
  Effect.flatMap(Ref.make(true), ackedRef => {
    const sendPayload = payloadOrReconnect(ackedRef, state).pipe(
      Effect.zipLeft(Ref.set(ackedRef, false)),
      Effect.flatMap(send),
    )

    const heartbeats = EffectU.foreverSwitch(
      Effect.zipLeft(hellos.take, Ref.set(ackedRef, true)),
      p =>
        Effect.schedule(
          sendPayload,
          Schedule.andThen(
            Schedule.duration(
              Duration.millis(p.d!.heartbeat_interval * Math.random()),
            ),
            Schedule.spaced(Duration.millis(p.d!.heartbeat_interval)),
          ),
        ),
    )

    const run = acks.take.pipe(
      Effect.zipLeft(Ref.set(ackedRef, true)),
      Effect.forever,
    )

    return Effect.all([run, heartbeats], {
      concurrency: "unbounded",
      discard: true,
    })
  })
