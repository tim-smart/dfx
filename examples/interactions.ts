import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import * as Cause from "@effect/io/Cause"
import * as Config from "@effect/io/Config"
import * as Effect from "@effect/io/Effect"
import { Discord, Ix } from "dfx"
import { DiscordGateway, makeLive, runIx } from "dfx/gateway"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeLive({
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
  _ =>
    Effect.all({
      who: _.optionValue("who"),
      greeting: Effect.map(
        _.optionValueOptional("greeting"),
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
  const gateway = yield* _(DiscordGateway)

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

  yield* _(
    Effect.all([gateway.run, interactions], {
      concurrency: "unbounded",
      discard: true,
    }),
  )
})

// Run it
program.pipe(
  Effect.provideLayer(LiveEnv),
  Effect.tapErrorCause(_ =>
    Effect.sync(() => {
      console.error(Cause.squash(_))
    }),
  ),
  Effect.runFork,
)
