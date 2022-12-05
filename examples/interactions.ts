import { Ix } from "../dist/index.js"
import * as Effect from "@effect/io/Effect"

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

const program = Ix.builder.add(hello).runGateway((e) => Effect.fail(e))
