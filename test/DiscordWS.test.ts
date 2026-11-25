import {
  DiscordWS,
  DiscordWSLive,
  JsonDiscordWSCodecLive,
  Reconnect,
} from "dfx/DiscordGateway/DiscordWS"
import * as Deferred from "effect/Deferred"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Socket from "effect/socket/Socket"
import * as TestClock from "effect/testing/TestClock"
import { settle, within } from "./utils/shard.ts"

/**
 * A WebSocket whose `close()` enters CLOSING and never emits a `close` event,
 * matching Node's global WebSocket when the TCP peer is gone.
 */
class BlackholedWebSocket extends EventTarget implements Socket.WebSocketLike {
  readyState = 0
  readonly url: string
  closeCode: number | undefined

  constructor(url: string) {
    super()
    this.url = url
    queueMicrotask(() => {
      if (this.readyState !== 0) return
      this.readyState = 1
      this.dispatchEvent(new Event("open"))
    })
  }

  close(code = 1000, _reason?: string) {
    if (this.readyState >= 2) return
    this.readyState = 2
    this.closeCode = code
  }

  send(_data: string | Uint8Array<ArrayBuffer>) {}
}

describe("DiscordWS", () => {
  it("opens a new socket after write(Reconnect) even when close() never fires a close event, and honors resetUrl", () => {
    const sockets: Array<BlackholedWebSocket> = []
    const opened = new Map<number, Deferred.Deferred<BlackholedWebSocket>>()
    const socketAt = (index: number) => {
      let d = opened.get(index)
      if (!d) {
        d = Deferred.makeUnsafe<BlackholedWebSocket>()
        opened.set(index, d)
      }
      return d
    }

    const FakeConstructor = Layer.succeed(Socket.WebSocketConstructor, url => {
      const ws = new BlackholedWebSocket(url)
      const index = sockets.push(ws) - 1
      Deferred.doneUnsafe(socketAt(index), Effect.succeed(ws))
      return ws
    })

    const TestLayer = DiscordWSLive.pipe(
      Layer.provide(JsonDiscordWSCodecLive),
      Layer.provideMerge(FakeConstructor),
    )

    return Effect.gen(function* () {
      const dws = yield* DiscordWS
      const conn = yield* dws.connect({ onConnecting: Effect.void })

      const first = yield* within(Deferred.await(socketAt(0)))
      yield* settle
      expect(first.url).toBe("wss://gateway.discord.gg/?v=10&encoding=json")

      yield* conn.setUrl("wss://resume.example")
      yield* conn.write(Reconnect)
      yield* settle
      expect(first.closeCode).toBe(3000)
      expect(sockets).toHaveLength(1)

      yield* TestClock.adjust("500 millis")
      const second = yield* within(Deferred.await(socketAt(1)))
      yield* settle
      expect(second.url).toBe("wss://resume.example?v=10&encoding=json")

      yield* conn.resetUrl
      yield* conn.write(Reconnect)
      yield* TestClock.adjust("1 second")
      const third = yield* within(Deferred.await(socketAt(2)))
      expect(third.url).toBe("wss://gateway.discord.gg/?v=10&encoding=json")
    }).pipe(
      Effect.scoped,
      Effect.provide(TestLayer),
      Effect.provide(TestClock.layer()),
      Effect.runPromise,
    )
  })
})
