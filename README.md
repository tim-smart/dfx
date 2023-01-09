# dfx

[![Discord](https://img.shields.io/discord/887189613389705256?style=for-the-badge)](https://discord.gg/dtR2Mtu66Q)

A Discord library built on top of @effect/io

- Supports both the gateway and webhooks
- Simple yet powerful abstractions to build Discord bots

## Example

```typescript
import * as Config from "@effect/io/Config"
import * as Effect from "@effect/io/Effect"
import { pipe } from "@fp-ts/data/Function"
import { Ix } from "dfx"
import { runIx, make } from "dfx/gateway"

// Create the dependencies layer
const Dependencies = make(
  Config.struct({
    token: Config.string("DISCORD_BOT_TOKEN"),
  }),
)

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
    Effect.catchAll((e) =>
      Effect.sync(() => {
        console.error("CAUGHT ERROR", e)
      }),
    ),
  ),
  Effect.providerLayer(Dependencies),
  Effect.unsafeRunPromise,
)
```
