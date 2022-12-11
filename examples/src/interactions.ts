import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import * as Exit from "@effect/io/Exit"
import { context } from "@fp-ts/data"
import { pipe } from "@fp-ts/data/Function"
import { Cache, Discord, Ix } from "dfx"
import { CachePrelude, make, runIx } from "dfx/gateway"
import { Success } from "dfx/utils/effect"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = make({
  token: process.env.DISCORD_BOT_TOKEN!,
})

const makeGuildsCache = CachePrelude.guilds(Cache.memoryDriver())
interface GuildsCache extends Success<typeof makeGuildsCache> {}
const GuildsCache = context.Tag<GuildsCache>()
const LiveGuildsCache = Effect.toLayer(GuildsCache)(makeGuildsCache)

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
  (i) =>
    pipe(
      Effect.struct({
        who: i.optionValue("who"),
        greeting: pipe(
          i.optionValueOptional("greeting"),
          Effect.someOrElse(() => "Hello"),
        ),
        // fail: i.optionValue("fail"), // <- this would be a type error
      }),
      Effect.map(({ who, greeting }) => ({
        type: 4,
        data: {
          content: `${greeting} ${who}!`,
        },
      })),
    ),
)

// Build your program use `Ix.builder`
const ix = Ix.builder.add(hello).add(greeting)

const program = pipe(
  ix,
  runIx(
    Effect.catchAll((e) =>
      Effect.sync(() => {
        console.error("CAUGHT ERROR", e)
      }),
    ),
  ),
)

// Run it
pipe(program, Effect.provideLayer(LiveEnv), Effect.unsafeRunPromiseExit).then(
  (exit) => {
    if (Exit.isFailure(exit)) {
      console.error(Cause.pretty()(exit.cause))
    }
  },
)
