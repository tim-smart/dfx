import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { identity, pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"
import * as CB from "callbag-effect-ts"
import { GatewayEvents } from "../types"
import * as Sharder from "./sharder"
import * as Utils from "./utils"

const make = T.gen(function* (_) {
  const shards = CB.share(Sharder.spawn)
  const raw = pipe(
    shards,
    CB.chainPar((s) => s.raw),
    CB.share,
  )
  const dispatch = pipe(
    shards,
    CB.chainPar((s) => s.dispatch),
    CB.share,
  )
  const fromDispatch = Utils.fromDispatch(dispatch)

  return {
    shards,
    raw,
    dispatch,
    fromDispatch,
  }
})

export interface DiscordGateway extends _A<typeof make> {}
export const DiscordGateway = tag<DiscordGateway>()
export const LiveDiscordGateway = T.toLayer(DiscordGateway)(make)

export const gateway = T.accessService(DiscordGateway)(identity)

export const fromDispatch = <K extends keyof GatewayEvents>(event: K) =>
  pipe(
    T.accessService(DiscordGateway)(({ fromDispatch }) => fromDispatch(event)),
    CB.unwrap,
  )
