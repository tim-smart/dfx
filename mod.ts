import { Effect as T, pipe } from "@effect-ts/core"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as Sch from "@effect-ts/core/Effect/Schedule"
import * as R from "@effect-ts/node/Runtime"
import * as WS from "./WSService"

pipe(
  T.accessServiceM(WS.WS)(({ open }) =>
    open("wss://gateway.discord.gg/?v=9&encoding=json")
  ),
  T.chain(({ read }) =>
    pipe(
      read,
      S.retry(Sch.exponential(10)),
      S.forEach((data) =>
        T.succeedWith(() => {
          console.error(data.toString("utf8"))
        })
      )
    )
  ),
  T.provideSomeLayer(WS.LiveWS),
  R.runMain
)
