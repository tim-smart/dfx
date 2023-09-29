# dfx

[![Discord](https://img.shields.io/discord/887189613389705256?style=for-the-badge)](https://discord.gg/dtR2Mtu66Q)

A Discord library built on top of effect

- Supports both the gateway and webhooks
- Simple yet powerful abstractions to build Discord bots

## Example

```typescript
import { Config, Effect, pipe } from "effect"
import { Ix } from "dfx"
import { runIx, makeFromConfig } from "dfx/gateway"

// Create the dependencies layer
const Dependencies = makeFromConfig({
  token: Config.secret("DISCORD_BOT_TOKEN"),
})

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

// Run it and handle errors
pipe(
  Ix.builder.add(hello),
  runIx(
    Effect.catchAll(e =>
      Effect.sync(() => {
        console.error("CAUGHT ERROR", e)
      }),
    ),
  ),
  Effect.provide(Dependencies),
  Effect.runFork,
)
```
