import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as M from "@effect-ts/core/Effect/Managed"
import { pipe } from "@effect-ts/core/Function"
import * as R from "@effect-ts/node/Runtime"
import * as Shard from "./DiscordShard"
import { LiveDiscordWS } from "./DiscordWS"
import { LiveLog, log } from "./Log"
import { GatewayIntents } from "./types"
import * as WS from "./WS"

pipe(
  Shard.make({
    token: process.env.DISCORD_BOT_TOKEN!,
    intents: GatewayIntents.GUILDS,
    shard: [0, 1],
  }),

  M.use(({ raw, effects }) =>
    pipe(
      effects,
      S.merge(
        pipe(
          S.fromHub_(raw),
          S.tap((p) => log(p))
        )
      ),
      S.runDrain
    )
  ),

  T.provideSomeLayer(LiveLog),
  T.provideSomeLayer(WS.LiveWS),
  T.provideSomeLayer(LiveDiscordWS),
  T.provideSomeLayer(Shard.LiveDiscordShard),

  R.runMain
)
