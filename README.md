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
import * as Dotenv from "dotenv"
import { Config, Effect, Layer } from "effect"

Dotenv.config()

// Create a config layer
const DiscordConfigLive = DiscordConfig.layerConfig({
  token: Config.secret("DISCORD_BOT_TOKEN"),
})

// Create hello service
const HelloLive = Layer.effectDiscard(
  Effect.gen(function* (_) {
    const registry = yield* _(InteractionsRegistry)

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
    yield* _(
      registry.register(Ix.builder.add(hello).catchAllCause(Effect.logError)),
    )
  }),
).pipe(
  // provide discord ix layer
  Layer.provide(DiscordIxLive),
)

// Construct the main layer
const MainLive = HelloLive.pipe(
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.provide(NodeSocket.layerWebSocketConstructor),
  Layer.provide(DiscordConfigLive),
)

// run it
NodeRuntime.runMain(Layer.launch(MainLive))
```
