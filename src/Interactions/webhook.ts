import Nacl from "tweetnacl"
import * as D from "./definitions.js"
import { handlers } from "./handlers.js"
import { InteractionBuilder } from "./index.js"

export class BadWebhookSignature {
  readonly _tag = "BadWebhookSignature"
}

export type Headers = Record<string, string | string[] | undefined>

const checkSignature = (publicKey: string, headers: Headers, body: string) =>
  Maybe.struct({
    signature: Maybe.fromNullable(headers["x-signature-ed25519"]),
    timestamp: Maybe.fromNullable(headers["x-signature-timestamp"]),
  })
    .filter((a) =>
      Nacl.sign.detached.verify(
        Buffer.from(a.timestamp + body),
        Buffer.from(`${a.signature}`, "hex"),
        Buffer.from(publicKey, "hex"),
      ),
    )
    .toEither(() => new BadWebhookSignature()).asUnit

export interface WebhookConfig {
  applicationId: string
  publicKey: string
}
export const WebhookConfig = Tag<WebhookConfig>()
export const makeConfig = (a: WebhookConfig) => Layer.succeed(WebhookConfig)(a)

export class WebhookParseError {
  readonly _tag = "WebhookParseError"
  constructor(readonly reason: unknown) {}
}

const fromHeadersAndBody = (headers: Headers, body: string) =>
  Do(($) => {
    const { publicKey } = $(Effect.service(WebhookConfig))
    $(Effect.fromEither(checkSignature(publicKey, headers, body)))
    return $(
      Effect.tryCatch(
        () => JSON.parse(body) as Discord.Interaction,
        (reason) => new WebhookParseError(reason),
      ),
    )
  })

const run = <R, E>(definitions: D.InteractionDefinition<R, E>[]) => {
  const handler = handlers(definitions)
  return (headers: Headers, body: string) =>
    Do(($) => {
      const interaction = $(fromHeadersAndBody(headers, body))
      return $(handler[interaction.type](interaction))
    })
}

export interface HandleWebhookOpts<E> {
  headers: Headers
  body: string
  success: (a: Discord.InteractionResponse) => Effect<never, never, void>
  error: (e: Cause<E>) => Effect<never, never, void>
  empty: Effect<never, never, void>
}

export const makeHandler = <R, E>(ix: InteractionBuilder<R, E>) => {
  const handle = run(ix.definitions)

  return ({
    headers,
    body,
    success,
    empty,
    error,
  }: HandleWebhookOpts<E | WebhookParseError | BadWebhookSignature>) =>
    handle(headers, body)
      .flatMap((o) =>
        o.match(
          () => empty,
          (a) => success(a),
        ),
      )
      .catchAllCause(error)
}
