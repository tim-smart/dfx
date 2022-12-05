import Nacl from "tweetnacl"
import * as D from "./definitions.js"
import { handlers } from "./handlers.js"
import { InteractionBuilder } from "./index.js"
import { fromHex } from "./utils.js"

export class BadWebhookSignature {
  readonly _tag = "BadWebhookSignature"
}

export type Headers = Record<string, string | string[] | undefined>

const checkSignature = (
  publicKey: Uint8Array,
  headers: Headers,
  body: string,
) =>
  Maybe.struct({
    signature: Maybe.fromNullable(headers["x-signature-ed25519"]),
    timestamp: Maybe.fromNullable(headers["x-signature-timestamp"]),
  })
    .filter((a) => {
      const enc = new TextEncoder()
      return Nacl.sign.detached.verify(
        enc.encode(a.timestamp + body),
        fromHex(`${a.signature}`),
        publicKey,
      )
    })
    .toEither(() => new BadWebhookSignature()).asUnit

export interface MakeConfigOpts {
  applicationId: string
  publicKey: string
}
const makeConfig = ({ applicationId, publicKey }: MakeConfigOpts) => ({
  applicationId,
  publicKey: fromHex(publicKey),
})
export interface WebhookConfig extends ReturnType<typeof makeConfig> {}
export const WebhookConfig = Tag<WebhookConfig>()
export const makeConfigLayer = flow(makeConfig, Layer.succeed(WebhookConfig))

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
