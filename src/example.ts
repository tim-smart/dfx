import { Ix, makeLayer } from "dfx"
import Dotenv from "dotenv"

Dotenv.config()

const LiveEnv = makeLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
})

const hello = Ix.guild(
  {
    name: "hello",
    description: "Eh yo",
    options: [
      {
        type: Discord.ApplicationCommandOptionType.STRING,
        name: "country",
        description: "What country are you from?",
        autocomplete: true,
      },
    ],
  },
  Ix.respond({
    type: 4,
    data: {
      content: "Hello",
    },
  }),
)

const autocomplete = Ix.autocomplete(
  Ix.option("country"),
  Ix.respond({
    type: 8,
    data: {
      choices: [
        {
          name: "New Zealand",
          value: "NZ",
        },
        {
          name: "United Kingdom",
          value: "UK",
        },
      ],
    },
  }),
)

Ix.builder
  .add(hello)
  .add(autocomplete)
  .runGateway()
  .provideLayer(LiveEnv)
  .unsafeRunPromiseExit.then((exit) => {
    if (exit.isFailure) {
      console.error(exit.cause.unsafeRunSync.pretty())
    }
  })
