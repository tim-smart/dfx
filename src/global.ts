/**
 * @tsplus global
 */
import type {
  Cause,
  Config,
  ConfigSecret,
  ConfigError,
  Deferred,
  Effect,
  Exit,
  Hub,
  Layer,
  RuntimeFiber,
  Dequeue,
  Enqueue,
  Queue,
  Schedule,
  Scope,
  Stream,
  Chunk,
  Context,
  Duration,
  Equal,
  Either,
  HashMap,
  Maybe,
  Ref,
  HashSet,
} from "dfx/_common"

/**
 * @tsplus global
 */
import { Tag, Discord } from "dfx/_common"

/**
 * @tsplus global
 */
import { pipe, flow, identity } from "@effect/data/Function"

/**
 * @tsplus global
 */
import type { LazyArg } from "@effect/data/Function"
