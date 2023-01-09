import * as Heartbeats from "./heartbeats.js"
import * as Identify from "./identify.js"
import * as InvalidSession from "./invalidSession.js"
import * as Utils from "./utils.js"

export const make = (shard: [id: number, count: number]) =>
  Do(($) => {
    const { token, gateway } = $(Effect.service(DiscordConfig.DiscordConfig))
    const limiter = $(Effect.service(RateLimiter))

    const outboundQueue = $(Queue.unbounded<DiscordWS.Message>())
    const outbound = outboundQueue
      .take()
      .tap(() => limiter.maybeWait("dfx.shard.send", Duration.minutes(1), 120))
    const send = (p: DiscordWS.Message) => outboundQueue.offer(p)

    const socket = $(DiscordWS.make({ outbound }))

    const raw = $(socket.source.broadcastDynamic(1))

    const [latestReady, updateLatestReady] = $(
      Utils.latest((p) =>
        Maybe.some(p)
          .filter(
            (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
              p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
          )
          .map((p) => p.d!),
      ),
    )
    const [latestSequence, updateLatestSequence] = $(
      Utils.latest((p) => Maybe.fromNullable(p.s)),
    )
    const maybeUpdateUrl = (p: Discord.GatewayPayload) =>
      Maybe.some(p)
        .filter(
          (p): p is Discord.GatewayPayload<Discord.ReadyEvent> =>
            p.op === Discord.GatewayOpcode.DISPATCH && p.t === "READY",
        )
        .map((p) => p.d!)
        .match(
          () => Effect.unit(),
          (a) => socket.setUrl(a.resume_gateway_url),
        )

    const updateRefs = raw
      .tap(updateLatestReady)
      .tap(updateLatestSequence)
      .tap(maybeUpdateUrl).runDrain

    // heartbeats
    const heartbeatEffects = Heartbeats.fromRaw(raw, latestSequence).runForEach(
      send,
    )

    const dispatch = raw.filter(
      (p): p is Discord.GatewayPayload<Discord.ReceiveEvent> =>
        p.op === Discord.GatewayOpcode.DISPATCH,
    )

    // identify
    const identifyEffects = Identify.fromRaw(raw, {
      token: token.value,
      shard,
      intents: gateway.intents,
      presence: gateway.presence,
      latestSequence,
      latestReady,
    }).runForEach(send)

    // invalid session
    const invalidEffects = InvalidSession.fromRaw(raw, latestReady).runForEach(
      send,
    )

    return {
      run: updateRefs
        .zipPar(heartbeatEffects)
        .zipPar(identifyEffects)
        .zipPar(invalidEffects).asUnit,
      raw,
      dispatch,
      send: (p: Discord.GatewayPayload) => send(p),
      reconnect: send(WS.Reconnect),
    }
  })
