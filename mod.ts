import { Effect as T, pipe } from "@effect-ts/core"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as Q from "@effect-ts/core/Effect/Queue"
import * as R from "@effect-ts/node/Runtime"
import * as DiscordWS from "./DiscordWS"
import { LiveLog, log } from "./Log"
import * as WS from "./WS"

pipe(
  Q.makeUnbounded<DiscordWS.Message>(),
  T.map(S.fromQueue()),
  T.chain((outgoing) =>
    T.accessService(DiscordWS.DiscordWS)(({ open }) => open({ outgoing }))
  ),
  T.chain(S.forEach((payload) => log(payload))),

  T.provideSomeLayer(LiveLog),
  T.provideSomeLayer(WS.LiveWS),
  T.provideSomeLayer(DiscordWS.LiveDiscordWS),

  R.runMain
)
