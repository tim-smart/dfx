import Dotenv from "dotenv"

Dotenv.config()

const LiveConfig = Config.makeLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
})

const RateLimitEnv =
  RateLimitStore.LiveMemoryRateLimitStore > RateLimitStore.LiveRateLimiter

const EnvLive =
  RateLimitEnv >
  (LiveConfig > Rest.LiveDiscordREST) + DWS.LiveJsonDiscordWSCodec

// Rest.rest
//   .getGatewayBot()
//   .repeatN(10)
//   .provideLayer(Log.LiveLogDebug >> EnvLive)
//   .unsafeRunPromise.catch(console.error)

const program = Do(($) => {
  const shard = $(Shard.make([0, 1]))

  $(
    shard.raw
      .tap((a) =>
        Effect.sync(() => {
          console.error("raw", a)
        }),
      )
      .runDrain.zipPar(shard.run),
  )
})
  .provideLayer(Log.LiveLogDebug > EnvLive)
  .unsafeRunPromise.catch(console.error)
