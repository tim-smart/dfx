# dfx

[![Discord](https://img.shields.io/discord/887189613389705256?style=for-the-badge)](https://discord.gg/dtR2Mtu66Q)

A Discord library built on top of effect

- Supports both the gateway and webhooks
- Simple yet powerful abstractions to build Discord bots

## Example

```typescript
import { NodeHttpClient, NodeRuntime, NodeSocket } from "@effect/platform-node"
import { DiscordConfig, Ix } from "dfx"
import { DiscordIxLive, InteractionsRegistry } from "dfx/gateway"
import { Config, Effect, Layer } from "effect"

// Create a layer for the discord services
const DiscordLayer = DiscordIxLive.pipe(
  Layer.provide([
    DiscordConfig.layerConfig({
      token: Config.redacted("DISCORD_BOT_TOKEN"),
    }),
    NodeHttpClient.layerUndici,
    NodeSocket.layerWebSocketConstructor,
  ]),
)

// Create hello service
const HelloLayer = Layer.effectDiscard(
  Effect.gen(function* () {
    const registry = yield* InteractionsRegistry

    // Create hello command that responds with "Hello!"
    const hello = Ix.global(
      {
        name: "hello",
        description: "A basic command",
      },
      Effect.succeed({
        type: 4,
        data: {
          content: "Hello!",
        },
      }),
    )

    // register the command(s) and handle errors
    yield* registry.register(
      Ix.builder.add(hello).catchAllCause(Effect.logError),
    )
  }),
).pipe(
  // provide discord layer
  Layer.provide(DiscordLayer),
)

// Construct the main layer
const MainLive = Layer.mergeAll(
  // add your other services here
  HelloLayer,
)

// run it
NodeRuntime.runMain(Layer.launch(MainLive))
```

## Handling dispatches before they are stored for RESUME

By default a shard stores each dispatch's sequence before it publishes the
dispatch. If your process stops before a handler finishes, the next RESUME
starts after that dispatch and Discord won't send it again.

To handle dispatches at least once, provide a `DispatchHook`. It runs for each
dispatch before the sequence is stored, so a dispatch is only stored for RESUME
after the hook completes:

```typescript
import { DispatchHook, DiscordIxLive } from "dfx/gateway"
import { Effect, Layer } from "effect"

const InboxHook = Layer.effect(
  DispatchHook,
  Effect.gen(function* () {
    const inbox = yield* Inbox // your durable queue
    return (payload, { shard, sessionId }) =>
      inbox.append({ key: [shard, sessionId, payload.s], payload })
  }),
)

const DiscordLayer = DiscordIxLive.pipe(
  Layer.provide(InboxHook),
  // ...the layers from the example above
)
```

What the hook gives you:

- It runs once per received dispatch, one at a time per shard, in sequence
  order. The stored sequence never passes a dispatch whose hook hasn't
  completed.
- If the shard shuts down while the hook runs, the hook is interrupted and the
  sequence isn't stored, so the next RESUME replays that dispatch.
- If the hook fails, the shard logs the error, reconnects and resumes from the
  last stored sequence. READY is the exception, see below.
- Heartbeats keep reporting the latest sequence received, however long the
  hook takes.

What it doesn't give you:

- Exactly-once delivery. Dispatches replayed after a RESUME go through the hook
  again and are published to every subscriber again. Dedupe on
  `(shard, sessionId, payload.s)`, since sequences restart with each new
  session, or make handling idempotent.
- Delivery beyond Discord's resume window. If the session can't be resumed,
  Discord sends an invalid session, the shard identifies again, and the missed
  dispatches are gone.
- Recovery when a new session's READY fails. The session is only stored once
  the hook and the store write for READY succeed. If either fails there is no
  session to resume, so the shard identifies again and gets a new READY.
  Dispatches the abandoned session sent after its READY are not replayed.

The hook runs on the shard's read loop, which also processes heartbeat ACKs.
Keep it short, for example by appending to a durable inbox and returning. A hook
that takes longer than the heartbeat interval (about 41 seconds) can make the
shard reconnect.
