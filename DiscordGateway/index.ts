import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { identity, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"
import * as Shard from "../DiscordShard"
import * as Utils from "./utils"
import * as CB from "callbag-effect-ts"
import { GatewayEvents } from "../types"

const make = pipe(
  Shard.make([0, 1]),
  M.map(
    (shard) =>
      ({
        _tag: "DiscordGatewayService",
        ...shard,
        fromDispatch: Utils.fromDispatch(shard.dispatch),
      } as const),
  ),
)

export interface DiscordGateway extends _A<typeof make> {}
export const DiscordGateway = tag<DiscordGateway>()
export const LiveDiscordGateway = M.toLayer(DiscordGateway)(make)

export const gateway = T.accessService(DiscordGateway)(identity)
export const run = T.accessServiceM(DiscordGateway)(({ run }) => run)

export const fromDispatch = <K extends keyof GatewayEvents>(event: K) =>
  pipe(
    T.accessService(DiscordGateway)(({ fromDispatch }) => fromDispatch(event)),
    CB.unwrap,
  )
