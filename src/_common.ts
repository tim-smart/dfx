import type { Schedule as _Schedule } from "@effect/io/Schedule"
import * as Deferred from "@effect/io/Deferred"

export type { Cause } from "@effect/io/Cause"
export type { Config } from "@effect/io/Config"
export type { ConfigSecret } from "@effect/io/Config/Secret"
export type { ConfigError } from "@effect/io/Config/Error"
export type { Deferred } from "@effect/io/Deferred"
export type { Effect } from "@effect/io/Effect"
export type { Exit } from "@effect/io/Exit"
export type { RuntimeFiber } from "@effect/io/Fiber"
export type { Hub } from "@effect/io/Hub"
export type { Layer } from "@effect/io/Layer"
export type { Dequeue, Enqueue, Queue } from "@effect/io/Queue"
export type { Ref } from "@effect/io/Ref"
export type { Scope } from "@effect/io/Scope"

export type { Stream } from "@effect/stream/Stream"

export type { Chunk } from "@effect/data/Chunk"
export { Context, Tag } from "@effect/data/Context"
export type { Duration } from "@effect/data/Duration"
export type { Equal } from "@effect/data/Equal"
export type { HashMap } from "@effect/data/HashMap"
export type { HashSet } from "@effect/data/HashSet"

export type { Option as Maybe } from "@effect/data/Option"
export type { Either } from "@effect/data/Either"

export * as Discord from "./types.js"

export * as ConfigWrap from "./utils/ConfigWrap.js"

/**
 * @tsplus type effect/io/Schedule
 * @tsplus companion effect/io/Schedule.Ops
 */
export type Schedule<Env, In, Out> = _Schedule<Env, In, Out>

/**
 * @tsplus getter effect/io/Deferred await
 */
export const deferredAwait: <E, A>(
  self: Deferred.Deferred<E, A>,
) => Effect<never, E, A> = Deferred.await
