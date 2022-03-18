import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"
import * as R from "@effect-ts/node/Runtime"
import * as CB from "callbag-effect-ts"
import * as Dotemv from "dotenv"
import * as Shard from "./DiscordShard"
import { log } from "./Log"
import { DebugEnv } from "./mod"
import { GatewayIntents } from "./types"

Dotemv.config()

const makeBot = pipe(
  Shard.make({
    token: process.env.DISCORD_BOT_TOKEN!,
    intents: GatewayIntents.GUILDS | GatewayIntents.GUILD_MESSAGES,
    shard: [0, 1],
  }),
  M.map(
    (bot) =>
      ({
        _tag: "BotService",
        bot,
      } as const),
  ),
)

interface Bot extends _A<typeof makeBot> {}
const Bot = tag<Bot>()
const LiveBot = M.toLayer(Bot)(makeBot)

const bot = T.accessService(Bot)(({ bot }) => bot)
const runBot = T.accessServiceM(Bot)(({ bot }) => bot.run)

// logger
const logger = T.chain_(bot, ({ raw }) => CB.forEach_(raw, (p) => log(p)))

// ping command
const pingPong = pipe(
  bot,
  T.map(({ fromDispatch }) => fromDispatch("MESSAGE_CREATE")),
  CB.unwrap,
  CB.filter((msg) => msg.content.startsWith("!ping")),
  CB.forEach((msg) => log("got ping", msg)),
)

pipe(
  runBot,
  T.zipPar(logger),
  T.zipPar(pingPong),

  T.provideSomeLayer(DebugEnv[">+>"](LiveBot)),
  R.runMain,
)
