import { NodeHttpClient, NodeRuntime, NodeSocket } from "@effect/platform-node"
import { DiscordConfig, Ix } from "dfx"
import { DiscordIxLive, InteractionsRegistry } from "dfx/gateway"
import * as Dotenv from "dotenv"
import { Config, Effect, Layer } from "effect"

Dotenv.config()

// Create a layer for the discord services
const DiscordLayer = DiscordIxLive.pipe(
  Layer.provide([
    DiscordConfig.layerConfig({
      token: Config.redacted("DISCORD_BOT_TOKEN"),
    }),
    NodeHttpClient.layerUndici,
    NodeSocket.layerWebSocketConstructor,
  ]),
)

// Create hello service
const HelloLayer = Layer.effectDiscard(
  Effect.gen(function* () {
    const registry = yield* InteractionsRegistry

    // Create hello command that responds with "Hello!"
    const hello = Ix.global(
      {
        name: "hello",
        description: "A basic command",
      },
      Effect.succeed({
        type: 4,
        data: {
          content: "Hello!",
        },
      }),
    )

    // register the command(s) and handle errors
    yield* registry.register(
      Ix.builder.add(hello).catchAllCause(Effect.logError),
    )
  }),
).pipe(
  // provide discord layer
  Layer.provide(DiscordLayer),
)

// Construct the main layer
const MainLive = Layer.mergeAll(
  // add your other services here
  HelloLayer,
)

// run it
NodeRuntime.runMain(Layer.launch(MainLive))
