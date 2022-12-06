# dfx

A Discord library built on top of @effect/io

- Supports both the gateway and webhooks
- Simple yet powerful abstractions to build Discord bots

## Example

```typescript
import * as Effect from "@effect/io/Effect"
import { pipe } from "@fp-ts/data/Function"
import { Ix, runIxGateway, makeLayer } from "dfx"

// Create the dependencies layer
const Dependencies = makeLayer({
  token: "xxx",
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
  runIxGateway(
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
