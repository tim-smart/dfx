import { makeFromConfig } from "dfx/webhooks"
import Dotenv from "dotenv"
import { fastify } from "fastify"

Dotenv.config()

// Create the dependencies layer
const LiveEnv = makeFromConfig(
  Config.struct({
    applicationId: Config.string("DISCORD_APP_ID"),
    publicKey: Config.secret("DISCORD_PUBLIC_KEY"),
    token: Config.secret("DISCORD_BOT_TOKEN"),
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
ix.syncGlobal.provideLayer(LiveEnv).unsafeRun()

// ==== HTTP handling
// You could replace this with another http server like express, or use edge
// functions.
//
const handleRequest = ix.webhookHandler

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
  handleRequest({
    headers: req.headers,
    body: req.body as string,
    success: (a) =>
      Effect.sync(() => {
        reply.send(a)
      }),
    error: (e) =>
      Effect.sync(() => {
        console.error("FAILURE", e.pretty())
        reply.code(500).send()
      }),
  })
    .provideLayer(LiveEnv)
    .unsafeRun()
})

// Start the server
server.listen({ host: "0.0.0.0", port: 3000 })
