import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import type * as Discord from "../../types.ts"

export interface DispatchHookContext {
  readonly shard: readonly [id: number, count: number]
  /**
   * Sequence numbers restart on every new session, so dedupe on
   * `(shard, sessionId, payload.s)`.
   */
  readonly sessionId: string
}

export type DispatchHookService = (
  payload: Discord.GatewayDispatchPayload,
  context: DispatchHookContext,
) => Effect.Effect<void>

/**
 * Runs for every dispatch a shard receives, before its sequence is stored for
 * RESUME and before it is published to subscribers.
 *
 * - Runs serially per shard, in sequence order.
 * - If the shard shuts down while the hook is running, the hook is interrupted
 *   and the sequence is not stored, so a later RESUME replays the dispatch.
 * - If the hook fails, the shard reconnects and resumes from the last stored
 *   sequence.
 *
 * Use it to hand dispatches to durable storage. Delivery is at-least-once
 * within Discord's resume window: dispatches replayed after a RESUME run
 * through the hook again, and if Discord rejects the RESUME the missed
 * dispatches are gone.
 *
 * The hook runs on the shard's read loop, so keep it short. A hook slower than
 * the heartbeat interval can make the shard reconnect.
 */
export const DispatchHook = Context.Reference<DispatchHookService>(
  "dfx/DiscordGateway/Shard/DispatchHook",
  { defaultValue: () => () => Effect.void },
)
