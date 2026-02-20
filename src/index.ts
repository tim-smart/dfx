import type { HttpClient } from "effect/unstable/http/HttpClient"
import * as Cache from "./Cache.ts"
import * as DiscordConfig from "./DiscordConfig.ts"
import type { DiscordREST } from "./DiscordREST.ts"
import { DiscordRESTLive } from "./DiscordREST.ts"
import * as Flags from "./Helpers/flags.ts"
import * as Intents from "./Helpers/intents.ts"
import * as IxHelpers from "./Helpers/interactions.ts"
import * as Members from "./Helpers/members.ts"
import * as Perms from "./Helpers/permissions.ts"
import * as UI from "./Helpers/ui.ts"
import * as Ix from "./Interactions/index.ts"
import { MemoryRateLimitStoreLive } from "./RateLimit.ts"
import * as Discord from "./types.ts"
import * as Layer from "effect/Layer"

export { DiscordREST, DiscordRESTLive } from "./DiscordREST.ts"

export {
  type BucketDetails,
  MemoryRateLimitStoreLive,
  RateLimitStore,
  RateLimiter,
  RateLimiterLive,
} from "./RateLimit.ts"

export {
  Cache,
  Discord,
  DiscordConfig,
  Flags,
  Intents,
  Ix,
  IxHelpers,
  Members,
  Perms,
  UI,
}

export const DiscordRESTMemoryLive: Layer.Layer<
  DiscordREST,
  never,
  DiscordConfig.DiscordConfig | HttpClient
> = DiscordRESTLive.pipe(Layer.provide(MemoryRateLimitStoreLive))
