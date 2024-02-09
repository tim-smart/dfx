import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as Ref from "effect/Ref"
import type { Message } from "dfx/DiscordGateway/DiscordWS"
import { Reconnect } from "dfx/DiscordGateway/WS"
import type * as Discord from "dfx/types"

export const fromPayload = (
  p: Discord.GatewayPayload,
  latestReady: Ref.Ref<Option.Option<Discord.ReadyEvent>>,
): Effect.Effect<Message> =>
  Effect.as(p.d ? Effect.unit : Ref.set(latestReady, Option.none()), Reconnect)
