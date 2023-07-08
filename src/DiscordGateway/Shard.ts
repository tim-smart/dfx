import { DiscordConfig } from "dfx/DiscordConfig"
import { LiveRateLimiter, RateLimiter } from "dfx/RateLimit"
import { DiscordWS, LiveDiscordWS, Message } from "./DiscordWS.js"
import * as Heartbeats from "./Shard/heartbeats.js"
import * as Identify from "./Shard/identify.js"
import * as InvalidSession from "./Shard/invalidSession.js"
import * as Utils from "./Shard/utils.js"
import { Reconnect } from "./WS.js"
import { Log } from "dfx/Log"

const enum Phase {
  Connecting,
  Handshake,
  Connected,
}

export const make = Do($ => {
  const { token, gateway } = $(DiscordConfig.accessWith(identity))
  const limiter = $(RateLimiter.accessWith(identity))
  const dws = $(DiscordWS.accessWith(identity))
  const log = $(Log.accessWith(identity))

  const connect = (
    shard: [id: number, count: number],
    hub: Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
    sendQueue: Dequeue<Discord.GatewayPayload<Discord.SendEvent>>,
  ) =>
    Do($ => {
      const outboundQueue = $(Queue.unbounded<Message>())
      const pendingQueue = $(Queue.unbounded<Message>())
      const phase = $(Ref.make(Phase.Connecting))
      const setPhase = (p: Phase) =>
        phase.set(p).zipLeft(log.debug("Shard", shard, "phase", p))
      const outbound = outboundQueue
        .take()
        .tap(() =>
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
        )

      const send = (p: Message) =>
        phase.get.flatMap(_ =>
          _ === Phase.Connected
            ? outboundQueue.offer(p)
            : pendingQueue.offer(p),
        )

      const heartbeatSend = (p: Message) =>
        phase.get.flatMap(_ =>
          _ !== Phase.Connecting
            ? outboundQueue.offer(p)
            : Effect.succeed(false),
        )

      const prioritySend = (p: Message) => outboundQueue.offer(p)

      const resume = setPhase(Phase.Connected)
        .zipRight(pendingQueue.takeAll())
        .tap(_ => outboundQueue.offerAll(_)).asUnit

      const onConnecting = outboundQueue
        .takeAll()
        .tap(_ =>
          pendingQueue.offerAll(
            _.filter(
              msg =>
                msg !== Reconnect &&
                msg.op !== Discord.GatewayOpcode.IDENTIFY &&
                msg.op !== Discord.GatewayOpcode.RESUME &&
                msg.op !== Discord.GatewayOpcode.HEARTBEAT,
            ),
          ),
        )
        .zipRight(setPhase(Phase.Connecting))

      const socket = $(dws.connect({ outbound, onConnecting }))

      const [latestReady, updateLatestReady] = $(
        Utils.latest(p =>
          Maybe.some(p)
            .filter(
              (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
                p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
            )
            .map(p => p.d!),
        ),
      )
      const [latestSequence, updateLatestSequence] = $(
        Utils.latest(p => Maybe.fromNullable(p.s)),
      )
      const maybeUpdateUrl = (p: Discord.GatewayPayload) =>
        Maybe.some(p)
          .filter(
            (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
              p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
          )
          .map(p => p.d!)
          .match({
            onNone: () => Effect.unit,
            onSome: ({ resume_gateway_url }) =>
              socket.setUrl(resume_gateway_url),
          })

      const hellos = $(Queue.unbounded<Discord.GatewayPayload>())
      const acks = $(Queue.unbounded<Discord.GatewayPayload>())

      // heartbeats
      const heartbeats = Heartbeats.send(
        hellos,
        acks,
        latestSequence,
        heartbeatSend,
      )

      // identify
      const identify = Identify.identifyOrResume(
        {
          token: token.value,
          shard,
          intents: gateway.intents,
          presence: gateway.presence,
        },
        latestReady,
        latestSequence,
      )

      const onPayload = (p: Discord.GatewayPayload) =>
        Do($ => {
          $(
            updateLatestReady(p)
              .zip(updateLatestSequence(p), { parallel: true })
              .zip(maybeUpdateUrl(p)),
          )

          let effect = Effect.unit

          switch (p.op) {
            case Discord.GatewayOpcode.HELLO:
              effect = identify
                .tap(prioritySend)
                .zip(setPhase(Phase.Handshake).zipRight(hellos.offer(p)), {
                  parallel: true,
                })
              break
            case Discord.GatewayOpcode.HEARTBEAT_ACK:
              effect = acks.offer(p)
              break
            case Discord.GatewayOpcode.INVALID_SESSION:
              effect = InvalidSession.fromPayload(p, latestReady).tap(send)
              break
            case Discord.GatewayOpcode.DISPATCH:
              if (p.t === "READY" || p.t === "RESUMED") {
                effect = resume.zipRight(hub.publish(p))
              } else {
                effect = hub.publish(p)
              }
              break
          }

          $(effect)
        })

      const drainSendQueue = sendQueue.take().tap(send).forever

      const run = Effect.all(
        socket.take.flatMap(onPayload).forever,
        heartbeats,
        drainSendQueue,
        socket.run,
        { discard: true, concurrency: "unbounded" },
      )

      return { id: shard, send, run } as const
    })

  return { connect } as const
})

export interface Shard extends Effect.Success<typeof make> {}
export const Shard = Tag<Shard>()
export const LiveShard =
  (LiveDiscordWS + LiveRateLimiter) >> Layer.effect(Shard, make)

export interface RunningShard
  extends Effect.Success<ReturnType<Shard["connect"]>> {}
