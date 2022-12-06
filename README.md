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
  Effect.succeedSome({
    type: 4,
    data: {
      content: "Hello!",
    },
  }),
)

// Run it
pipe(
  Ix.builder.add(hello),
  runIxGateway((error) => Effect.fail(error)),
  Effect.providerLayer(Dependencies),
  Effect.unsafeRunPromise,
)
```
