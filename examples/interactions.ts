import { Discord, DiscordConfig, Ix } from "dfx"
import { DiscordLive, runIx } from "dfx/gateway"
import Dotenv from "dotenv"
import { Cause, Config, Effect, Layer, Option, pipe } from "effect"
import * as NodeHttp from "@effect/platform-node/NodeHttpClient"

Dotenv.config()

// Create the dependencies layer
const DiscordConfigLive = DiscordConfig.layerConfig({
  token: Config.secret("DISCORD_BOT_TOKEN"),
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
    Effect.all({
      who: ix.optionValue("who"),
      greeting: Effect.map(
        ix.optionValueOptional("greeting"),
        Option.getOrElse(() => "Hello"),
      ),
      // fail: _.optionValue("fail"), // <- this would be a type error
    }).pipe(
      Effect.map(({ greeting, who }) => ({
        type: 4,
        data: {
          content: `${greeting} ${who}!`,
        },
      })),
    ),
)

// Build your program use `Ix.builder`
const program = Effect.gen(function* (_) {
  const interactions = pipe(
    Ix.builder.add(hello).add(greeting),
    runIx(
      Effect.catchAll(e =>
        Effect.sync(() => {
          console.error("CAUGHT INTERACTION ERROR", e)
        }),
      ),
    ),
  )

  yield* _(interactions)
})

const EnvLive = DiscordLive.pipe(
  Layer.provide(NodeHttp.layer),
  Layer.provide(DiscordConfigLive),
)

// Run it
program.pipe(
  Effect.provide(EnvLive),
  Effect.tapErrorCause(_ =>
    Effect.sync(() => {
      console.error(Cause.squash(_))
    }),
  ),
  Effect.runFork,
)
