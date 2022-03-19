import * as T from "@effect-ts/core/Effect"
import * as M from "@effect-ts/core/Effect/Managed"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"
import { _A } from "@effect-ts/core/Utils"
import * as Shard from "../DiscordShard"
import { fromDispatch } from "./utils"

const make = pipe(
  Shard.make([0, 1]),
  M.map(
    (shard) =>
      ({
        _tag: "BotService",
        ...shard,
        fromDispatch: fromDispatch(shard.dispatch),
      } as const),
  ),
)

export interface Bot extends _A<typeof make> {}
export const Bot = tag<Bot>()
export const LiveBot = M.toLayer(Bot)(make)

export const run = T.accessServiceM(Bot)(({ run }) => run)
