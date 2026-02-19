import { NodeHttpClient, NodeSocket } from "@effect/platform-node"
import { Discord, DiscordConfig, Ix } from "dfx"
import { DiscordLive, runIx } from "dfx/gateway"
import Dotenv from "dotenv"
import { Config, Effect, Layer, pipe } from "effect"

Dotenv.config()

// Create the dependencies layer
const DiscordConfigLive = DiscordConfig.layerConfig({
  token: Config.redacted("DISCORD_BOT_TOKEN"),
})

// Create your interaction definitions.
// Here we are creating a global application command.
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

// Optionally use the type safe helpers
const greeting = Ix.global(
  {
    name: "greeting",
    description: "A basic command",
    options: [
      {
        type: Discord.ApplicationCommandOptionType.STRING,
        name: "who",
        description: "who to greet",
        required: true,
      },
      {
        type: Discord.ApplicationCommandOptionType.STRING,
        name: "greeting",
        description: "What kind of greeting?",
      },
    ],
  },
  ix =>
    Effect.succeed({
      type: 4,
      data: {
        content: `${ix.optionValueOrElse("greeting", () => "Hello")} ${ix.optionValue("who")}!`,
      },
      // fail: ix.optionValue("fail"), // <- this would be a type error
    }),
)

// Build your program use `Ix.builder`
const program = Effect.gen(function* () {
  const interactions = pipe(
    Ix.builder.add(hello).add(greeting),
    runIx(Effect.catch(e => Effect.logError("CAUGHT INTERACTION ERROR", e))),
  )

  yield* Effect.asVoid(interactions)
})

const EnvLive = DiscordLive.pipe(
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.provide(NodeSocket.layerWebSocketConstructor),
  Layer.provide(DiscordConfigLive),
)

// Run it
program.pipe(
  Effect.provide(EnvLive),
  Effect.tapCause(Effect.logError),
  Effect.runFork,
)
