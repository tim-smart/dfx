import Dotenv from "dotenv"

Dotenv.config()

const LiveConfig = Config.makeLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
})

const RateLimitEnv =
  RateLimitStore.LiveMemoryRateLimitStore > RateLimitStore.LiveRateLimiter

const EnvLive = RateLimitEnv > (LiveConfig > Rest.LiveDiscordREST)

Rest.rest
  .getGatewayBot()
  .tap(({ data }) =>
    Effect.sync(() => {
      console.error(data)
    }),
  )
  .repeatN(10)
  .provideLayer(Log.LiveLogDebug >> EnvLive)
  .unsafeRunPromise.catch(console.error)
