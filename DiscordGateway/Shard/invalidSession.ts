import * as T from "@effect-ts/core/Effect"
import * as R from "@effect-ts/core/Effect/Ref"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import * as CB from "callbag-effect-ts"
import { Message } from "../DiscordWS"
import {
  GatewayOpcode,
  GatewayPayload,
  InvalidSessionEvent,
  ReadyEvent,
} from "../../types"
import { Reconnect } from "../WS"
import * as Utils from "./utils"

export const fromRaw = <R, E>(
  raw: CB.EffectSource<R, E, GatewayPayload>,
  latestReady: R.Ref<O.Option<ReadyEvent>>,
) =>
  pipe(
    Utils.opCode(raw)<InvalidSessionEvent>(GatewayOpcode.INVALID_SESSION),
    CB.tap((p) => (p.d ? T.unit : R.set_(latestReady, O.none))),
    CB.map((): Message => Reconnect),
  )
