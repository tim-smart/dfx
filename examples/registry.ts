import { NodeHttpClient, NodeSocket } from "@effect/platform-node"
import { Discord, DiscordConfig, Ix } from "dfx"
import { DiscordIxLive, InteractionsRegistry } from "dfx/gateway"
import Dotenv from "dotenv"
import { Config, Effect, Layer, LogLevel, Logger } from "effect"

Dotenv.config()

// Create your service and register your interactions
const makeGreetService = Effect.gen(function* () {
  const registry = yield* InteractionsRegistry

  const greet = Ix.global(
    {
      name: "greet",
      description: "A basic command",
      options: [
        {
          name: "name",
          description: "who to greet",
          type: Discord.ApplicationCommandOptionType.STRING,
          required: true,
        },
      ],
    },
    ix =>
      Effect.succeed(
        Ix.response({
          type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Hello ${ix.optionValue("name")}!`,
          },
        }),
      ),
  )

  // create a builder
  const ix = Ix.builder.add(greet).catchAllCause(Effect.logError)

  // register the interactions
  yield* registry.register(ix)
})

// Greet service layer
const GreetLive = Layer.effectDiscard(makeGreetService)

// Main layer
const MainLive = GreetLive.pipe(
  Layer.provide(DiscordIxLive),
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.provide(NodeSocket.layerWebSocketConstructor),
  Layer.provide(
    DiscordConfig.layerConfig({
      token: Config.redacted("DISCORD_BOT_TOKEN"),
    }),
  ),
  Layer.provide(Logger.logFmt),
)

Layer.launch(MainLive).pipe(
  Effect.catchAllCause(Effect.logError),
  Logger.withMinimumLogLevel(LogLevel.Trace),
  Effect.runFork,
)
