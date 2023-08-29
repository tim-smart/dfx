import { Discord, Ix } from "dfx"
import {
  DiscordGateway,
  gatewayLayer,
  InteractionsRegistry,
  InteractionsRegistryLive,
} from "dfx/gateway"
import Dotenv from "dotenv"
import { Config, Effect, Layer } from "effect"

Dotenv.config()

// Create your service and register your interactions
const makeGreetService = Effect.gen(function* (_) {
  const registry = yield* _(InteractionsRegistry)

  const greet = Ix.global(
    {
      name: "greet",
      description: "A basic command",
      options: [
        {
          name: "name",
          description: "who to greet",
          type: Discord.ApplicationCommandOptionType.STRING,
          required: true,
        },
      ],
    },
    ix =>
      Effect.all({
        name: ix.optionValue("name"),
      }).pipe(
        Effect.map(({ name }) =>
          Ix.response({
            type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Hello ${name}!`,
            },
          }),
        ),
      ),
  )

  // create a builder
  const ix = Ix.builder.add(greet).catchAllCause(Effect.logError)

  // register the interactions
  yield* _(registry.register(ix))
})

// Greet service layer
const GreetLive = Layer.provide(
  InteractionsRegistryLive,
  Layer.effectDiscard(makeGreetService),
)

// main program
const main = Effect.gen(function* (_) {
  const gateway = yield* _(DiscordGateway)
  const registry = yield* _(InteractionsRegistry)

  yield* _(
    Effect.all([registry.run(Effect.logError), gateway.run], {
      concurrency: "unbounded",
      discard: true,
    }),
  )
})

// Create the dependencies layer
const DiscordLive = gatewayLayer({
  token: Config.secret("DISCORD_BOT_TOKEN"),
  debug: Config.withDefault(Config.boolean("DEBUG"), false),
})

// Add our GreetLive layer
const MainLive = Layer.provideMerge(DiscordLive, GreetLive)

main.pipe(
  Effect.provideLayer(MainLive),
  Effect.catchAllCause(Effect.logError),
  Effect.runFork,
)
