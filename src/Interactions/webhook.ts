import Nacl from "tweetnacl"
import * as D from "./definitions.js"
import { handlers } from "./handlers.js"

export class BadWebhookSignature {
  readonly _tag = "BadWebhookSignature"
}

const checkSignature = (
  publicKey: string,
  headers: Record<string, string>,
  body: string,
) =>
  Maybe.struct({
    signature: Maybe.fromNullable(headers["x-signature-ed25519"]),
    timestamp: Maybe.fromNullable(headers["x-signature-timestamp"]),
  })
    .filter((a) =>
      Nacl.sign.detached.verify(
        Buffer.from(a.timestamp + body),
        Buffer.from(a.signature, "hex"),
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

const fromHeadersAndBody = (headers: Record<string, string>, body: string) =>
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

export const run = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
  headers: Record<string, string>,
  body: string,
) =>
  Do(($) => {
    const interaction = $(fromHeadersAndBody(headers, body))
    return $(handlers(definitions)[interaction.type](interaction))
  })
