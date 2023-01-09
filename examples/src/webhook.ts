import * as Config from "@effect/io/Config"
import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import { pipe } from "@fp-ts/data/Function"
import { Ix } from "dfx"
import { make, makeHandler } from "dfx/webhooks"
import Dotenv from "dotenv"
import { fastify } from "fastify"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = make(
  Config.struct({
    applicationId: Config.string("DISCORD_APP_ID"),
    publicKey: Config.string("DISCORD_PUBLIC_KEY"),
    token: Config.string("DISCORD_BOT_TOKEN"),
  }),
)

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

// Build your interactions handler
const ix = Ix.builder.add(hello)

// Optionally sync the commands
pipe(ix.syncGlobal, Effect.provideLayer(LiveEnv), Effect.unsafeRun)

// ==== HTTP handling
// You could replace this with another http server like express, or use edge
// functions.
//
const handleRequest = makeHandler(ix)

// Create a fastify server to handle http requests
const server = fastify()

// We need string request bodies to verify the webhook signature
server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (_, payload, done) => {
    done(null, payload)
  },
)

// Register the http route
server.post("/", (req, reply) => {
  // Here we pass in the request headers, raw http body as a string, and how we
  // want to handle the results.
  pipe(
    handleRequest({
      headers: req.headers,
      body: req.body as string,
      success: (a) =>
        Effect.sync(() => {
          reply.send(a)
        }),
      error: (e) =>
        Effect.sync(() => {
          console.error("FAILURE", Cause.pretty()(e))
          reply.code(500).send()
        }),
    }),
    Effect.provideLayer(LiveEnv),
    Effect.unsafeRun,
  )
})

// Start the server
server.listen({ host: "0.0.0.0", port: 3000 })
