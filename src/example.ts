import { Ix, makeLayer, rest } from "dfx"
import Dotenv from "dotenv"

Dotenv.config()

const LiveEnv = makeLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
})

Ix.builder
  .add(
    Ix.guild(
      {
        name: "hello",
      },
      (i) =>
        rest.createInteractionResponse(i.id, i.token, {
          type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Hello",
          },
        }),
    ),
  )
  .runGateway.provideLayer(LiveEnv)
  .unsafeRunPromise.catch(console.error)
