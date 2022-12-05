import * as Cause from "@effect/io/Cause"
import * as Effect from "@effect/io/Effect"
import { pipe } from "@fp-ts/data/Function"
import { Ix, makeLayer } from "dfx/webhooks"
import Dotenv from "dotenv"
import { fastify } from "fastify"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeLayer({
  applicationId: process.env.DISCORD_APP_ID!,
  publicKey: process.env.DISCORD_PUBLIC_KEY!,
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

// Build your interactions handler
const ix = Ix.builder.add(hello)

// Optionally sync the commands
pipe(ix.syncGlobal, Effect.provideLayer(LiveEnv), Effect.unsafeRunAsync)

// ==== HTTP handling
// You could replace this with another http server like express, or use edge
// functions.
//
const handleRequest = Ix.makeWebhookHandler(ix)

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
      empty: Effect.sync(() => {
        console.error("NO RESPONSE")
        reply.code(500).send()
      }),
      error: (e) =>
        Effect.sync(() => {
          console.error("FAILURE", Cause.pretty()(e))
          reply.code(500).send()
        }),
    }),
    Effect.provideLayer(LiveEnv),
    Effect.unsafeRunAsync,
  )
})

// Start the server
server.listen({ host: "0.0.0.0", port: 3000 })
