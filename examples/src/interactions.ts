import { makeFromConfig } from "dfx/gateway"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeFromConfig(
  Config.struct({
    token: Config.secret("DISCORD_BOT_TOKEN"),
  }),
  true,
)

// Create your interaction definitions.
// Here we are creating a global application command.
const hello = Ix.global(
  {
    name: "hello",
    description: "A basic command",
  } as const,
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
  } as const,
  (i) =>
    Effect.struct({
      who: i.optionValue("who"),
      greeting: i.optionValueOptional("greeting").someOrElse(() => "Hello"),
      // fail: i.optionValue("fail"), // <- this would be a type error
    }).map(({ who, greeting }) => ({
      type: 4,
      data: {
        content: `${greeting} ${who}!`,
      },
    })),
)

// Build your program use `Ix.builder`
const ix = Ix.builder.add(hello).add(greeting)

const program = ix.runGateway((a) =>
  a.catchAll((e) =>
    Effect.sync(() => {
      console.error("CAUGHT ERROR", e)
    }),
  ),
)

// Run it
program.provideLayer(LiveEnv).unsafeRun((exit) => {
  if (exit.isFailure()) {
    console.error(exit.cause.pretty())
  }
})
