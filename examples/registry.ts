import { NodeHttpClient, NodeSocket } from "@effect/platform-node"
import { Discord, DiscordConfig, Ix, UI } from "dfx"
import { DiscordIxLive, InteractionsRegistry } from "dfx/gateway"
import Dotenv from "dotenv"
import { Config, Effect, Layer, Logger } from "effect"

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
          type: Discord.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
          data: UI.components([
            UI.textDisplay(`Hello ${ix.optionValue("name")}!`),
            UI.row([
              UI.button({ custom_id: "one", label: "Click me!" }),
              UI.button({ custom_id: "two", label: "Click me 2!" }),
            ]),
          ]),
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
  Layer.provide(Logger.layer([Logger.consoleLogFmt])),
)

Layer.launch(MainLive).pipe(Effect.catchCause(Effect.logError), Effect.runFork)
