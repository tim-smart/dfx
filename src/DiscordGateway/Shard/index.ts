import * as Heartbeats from "./heartbeats.js"
import * as Identify from "./identify.js"
import * as InvalidSession from "./invalidSession.js"
import * as Utils from "./utils.js"

export const make = (shard: [id: number, count: number]) =>
  Do(($) => {
    const { token, gateway } = $(Effect.service(Config.DiscordConfig))

    const socket = $(DWS.make())

    const [emit, outgoing] = EffectSource.asyncEmitter<never, DWS.Message>()
    const limiter = $(Effect.service(RateLimitStore.RateLimiter))
    const sendEffect = outgoing
      .tap(() => limiter.maybeWait("shard.send", Duration.minutes(1), 120))
      .run(socket.sink)

    const raw = $(socket.source.share)
    const sendMessage = (a: DWS.Message) =>
      Effect.sync(() => {
        emit.data(a)
      })

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
    const heartbeatEffects = Heartbeats.fromRaw(raw, latestSequence).forEach(
      sendMessage,
    )

    const dispatch = raw.filter(
      (p): p is Discord.GatewayPayload<Discord.ReceiveEvent> =>
        p.op === Discord.GatewayOpcode.DISPATCH,
    )

    // identify
    const identifyEffects = Identify.fromRaw(raw, {
      token,
      shard,
      intents: gateway.intents,
      presence: gateway.presence,
      latestSequence,
      latestReady,
    }).forEach(sendMessage)

    // invalid session
    const invalidEffects = InvalidSession.fromRaw(raw, latestReady).forEach(
      sendMessage,
    )

    return {
      run: updateRefs
        .zipPar(heartbeatEffects)
        .zipPar(identifyEffects)
        .zipPar(invalidEffects)
        .zipPar(sendEffect),
      raw,
      dispatch,
      send: (p: Discord.GatewayPayload) => emit.data(p),
      reconnect: () => emit.data(WS.Reconnect),
    }
  })
