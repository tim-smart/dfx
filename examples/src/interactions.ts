import { makeLive } from "dfx/gateway"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeLive({
  token: Config.secret("DISCORD_BOT_TOKEN"),
}, true)

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
  _ =>
    Effect.all({
      who: _.optionValue("who"),
      greeting: _.optionValueOptional("greeting").someOrElse(() => "Hello"),
      // fail: _.optionValue("fail"), // <- this would be a type error
    }).map(({ who, greeting }) => ({
      type: 4,
      data: {
        content: `${greeting} ${who}!`,
      },
    })),
)

// Build your program use `Ix.builder`
const ix = Ix.builder.add(hello).add(greeting)

const program = ix.runGateway(_ =>
  _.catchAll(e =>
    Effect.sync(() => {
      console.error("CAUGHT INTERACTION ERROR", e)
    }),
  ),
)

// Run it
program.provideLayer(LiveEnv).tapErrorCause(_ =>
  Effect(() => {
    console.error(_.squash)
  }),
).runFork
