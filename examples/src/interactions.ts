import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import * as Exit from "@effect/io/Exit"
import { pipe } from "@fp-ts/data/Function"
import { Ix } from "dfx"
import { make, runIx } from "dfx/gateway"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = make({
  token: process.env.DISCORD_BOT_TOKEN!,
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

// Build your program use `Ix.builder`
const ix = Ix.builder.add(hello)

// Run it
pipe(
  ix,
  runIx(
    Effect.catchAll((e) =>
      Effect.sync(() => {
        console.error("CAUGHT ERROR", e)
      }),
    ),
  ),
  Effect.provideLayer(LiveEnv),
  Effect.unsafeRunPromiseExit,
).then((exit) => {
  if (Exit.isFailure(exit)) {
    console.error(Cause.pretty()(exit.cause))
  }
})
