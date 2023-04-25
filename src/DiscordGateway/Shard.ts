import { DiscordConfig } from "dfx/DiscordConfig"
import { LiveRateLimiter, RateLimiter } from "dfx/RateLimit"
import { DiscordWS, LiveDiscordWS, Message } from "./DiscordWS.js"
import * as Heartbeats from "./Shard/heartbeats.js"
import * as Identify from "./Shard/identify.js"
import * as InvalidSession from "./Shard/invalidSession.js"
import * as Utils from "./Shard/utils.js"
import { Reconnect } from "./WS.js"

export const make = Do($ => {
  const { token, gateway } = $(DiscordConfig)
  const limiter = $(RateLimiter)
  const dws = $(DiscordWS)

  const connect = (
    shard: [id: number, count: number],
    hub: Hub<Discord.GatewayPayload<Discord.ReceiveEvent>>,
  ) =>
    Do($ => {
      const outboundQueue = $(Queue.unbounded<Message>())
      const outbound = outboundQueue
        .take()
        .tap(() =>
          limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120),
        )
      const send = (p: Message) => outboundQueue.offer(p)

      const socket = $(dws.connect({ outbound }))

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
          .match(
            () => Effect.unit(),
            a => socket.setUrl(a.resume_gateway_url),
          )

      const hellos = $(Queue.unbounded<Discord.GatewayPayload>())
      const acks = $(Queue.unbounded<Discord.GatewayPayload>())

      // heartbeats
      const heartbeats = Heartbeats.send(hellos, acks, latestSequence, send)

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
              .zipPar(updateLatestSequence(p))
              .zipPar(maybeUpdateUrl(p)),
          )

          let effect = Effect.unit()

          switch (p.op) {
            case Discord.GatewayOpcode.HELLO:
              effect = identify.tap(send).zipPar(hellos.offer(p))
              break
            case Discord.GatewayOpcode.HEARTBEAT_ACK:
              effect = acks.offer(p)
              break
            case Discord.GatewayOpcode.INVALID_SESSION:
              effect = InvalidSession.fromPayload(p, latestReady).tap(send)
              break
            case Discord.GatewayOpcode.DISPATCH:
              effect = hub.publish(p)
              break
          }

          $(effect)
        })

      const run = socket.take
        .flatMap(onPayload)
        .forever.zipParLeft(heartbeats)
        .zipParLeft(socket.run)

      return {
        run,
        send: (p: Discord.GatewayPayload) => send(p),
        reconnect: send(Reconnect),
      } as const
    })

  return { connect } as const
})

export interface Shard extends Effect.Success<typeof make> {}
export const Shard = Tag<Shard>()
export const LiveShard =
  (LiveDiscordWS + LiveRateLimiter) >> make.toLayer(Shard)
