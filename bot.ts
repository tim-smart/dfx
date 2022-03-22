import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import * as R from "@effect-ts/node/Runtime"
import * as CB from "callbag-effect-ts"
import * as Dotenv from "dotenv"
import { log } from "./Log"
import {
  callRest,
  DebugEnv,
  fromDispatch,
  gateway,
  makeConfigLayer,
  rest,
  run,
} from "./mod"
import { GatewayIntents } from "./types"

Dotenv.config()

const Config = makeConfigLayer({
  token: process.env.DISCORD_BOT_TOKEN!,
  gateway: {
    intents: GatewayIntents.GUILDS | GatewayIntents.GUILD_MESSAGES,
  },
})

// logger
const logger = T.chain_(gateway, ({ raw }) => CB.forEach_(raw, (p) => log(p)))

// ping command
const pingPong = pipe(
  fromDispatch("MESSAGE_CREATE"),
  CB.filter((msg) => msg.content.startsWith("!ping")),
  CB.forEach((msg) =>
    callRest("createMessage", msg.channel_id, {
      content: "Pong!",
    }),
  ),
)

pipe(
  run,
  T.zipPar(logger),
  T.zipPar(pingPong),

  T.provideSomeLayer(DebugEnv),
  T.provideSomeLayer(Config),
  R.runMain,
)
