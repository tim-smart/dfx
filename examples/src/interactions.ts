import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import * as Exit from "@effect/io/Exit"
import { pipe } from "@fp-ts/data/Function"
import { Ix, makeLayer } from "dfx"
import Dotenv from "dotenv"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
})

// Create your interaction definitions.
// Here we are creating a global application command.
const hello = Ix.global(
  {
    name: "hello",
    description: "A basic command",
  },
  Effect.succeedSome({
    type: 4,
    data: {
      content: "Hello!",
    },
  }),
)

// Build your program use `Ix.builder`
const program = Ix.builder.add(hello).runGateway((e) => Effect.fail(e))

// Run it
pipe(program, Effect.provideLayer(LiveEnv), Effect.unsafeRunPromiseExit).then(
  (exit) => {
    if (Exit.isFailure(exit)) {
      console.error(pipe(exit.cause, Cause.pretty()))
    }
  },
)
