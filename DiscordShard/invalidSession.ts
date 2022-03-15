import * as T from "@effect-ts/core/Effect"
import * as S from "@effect-ts/core/Effect/Experimental/Stream"
import * as H from "@effect-ts/core/Effect/Hub"
import * as R from "@effect-ts/core/Effect/Ref"
import { pipe } from "@effect-ts/core/Function"
import * as O from "@effect-ts/core/Option"
import { Message } from "../DiscordWS"
import {
  GatewayOpcode,
  GatewayPayload,
  InvalidSessionEvent,
  ReadyEvent,
} from "../types"
import { Reconnect } from "../WS"
import * as Utils from "./utils"

export const fromHub = (
  hub: H.Hub<GatewayPayload>,
  latestReady: R.Ref<O.Option<ReadyEvent>>
) =>
  pipe(
    Utils.opCode(hub)<InvalidSessionEvent>(GatewayOpcode.INVALID_SESSION),
    S.tap((p) => (p.d ? T.unit : R.set_(latestReady, O.none))),
    S.map((): Message => Reconnect)
  )
