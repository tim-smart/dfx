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
        type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
        name: "one",
        description: "The first sub command",
      },
      {
        type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
        name: "two",
        description: "The second sub command",
      },
    ],
  },
  Ix.handleSubCommands({
    one: Effect.succeed({
      type: 4,
      data: {
        content: "One",
      },
    }),

    two: Ix.getSubCommand.map((a) => ({
      type: 4,
      data: {
        content: a.name,
      },
    })),
  }),
)

Ix.builder
  .add(hello)
  .runGateway()
  .provideLayer(LiveEnv)
  .unsafeRunPromiseExit.then((exit) => {
    if (exit.isFailure) {
      console.error(exit.cause.unsafeRunSync.pretty())
    }
  })
