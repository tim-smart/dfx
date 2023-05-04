import Nacl from "tweetnacl"
import * as D from "./definitions.js"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { InteractionBuilder, Interaction } from "./index.js"
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
    .filter(a => {
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
  publicKey: ConfigSecret
}
const makeConfig = ({ applicationId, publicKey }: MakeConfigOpts) => ({
  applicationId,
  publicKey: fromHex(publicKey.value),
})
export interface WebhookConfig extends ReturnType<typeof makeConfig> {}
export const WebhookConfig = Tag<WebhookConfig>()
export const makeConfigLayer = flow(makeConfig, _ =>
  Layer.succeed(WebhookConfig, _),
)
export const makeFromConfig = (a: Config<MakeConfigOpts>) =>
  a.config.map(makeConfig).toLayer(WebhookConfig)

export class WebhookParseError {
  readonly _tag = "WebhookParseError"
  constructor(readonly reason: unknown) {}
}

const fromHeadersAndBody = (headers: Headers, body: string) =>
  Do($ => {
    const { publicKey } = $(WebhookConfig)
    $(checkSignature(publicKey, headers, body))
    return $(
      Effect.tryCatch(
        () => JSON.parse(body) as Discord.Interaction,
        reason => new WebhookParseError(reason),
      ),
    )
  })

const run = <R, E>(
  definitions: Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (
        self: Effect<R, E, Discord.InteractionResponse>,
      ) => Effect<R, E, Discord.InteractionResponse>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect<R, E, Discord.InteractionResponse>,
) => {
  const handler = handlers(definitions, handleResponse)
  return (headers: Headers, body: string) =>
    Do($ => {
      const interaction = $(fromHeadersAndBody(headers, body))
      return $(
        handler[interaction.type](interaction).provideService(
          Interaction,
          interaction,
        ),
      )
    })
}

export interface HandleWebhookOpts<E> {
  headers: Headers
  body: string
  success: (a: Discord.InteractionResponse) => Effect<never, never, void>
  error: (e: Cause<E>) => Effect<never, never, void>
}

/**
 * @tsplus getter dfx/InteractionBuilder webhookHandler
 */
export const makeHandler = <R, E, TE>(ix: InteractionBuilder<R, E, TE>) => {
  const handle = run(
    ix.definitions.map(([d]) => [d, identity] as any),
    (_i, r) => Effect.succeed(r),
  )

  return ({
    headers,
    body,
    success,
    error,
  }: HandleWebhookOpts<
    E | WebhookParseError | BadWebhookSignature | DefinitionNotFound
  >) => handle(headers, body).flatMap(success).catchAllCause(error)
}

/**
 * @tsplus getter dfx/InteractionBuilder simpleWebhookHandler
 */
export const makeSimpleHandler = <R, E, TE>(
  ix: InteractionBuilder<R, E, TE>,
) => {
  const handle = run(
    ix.definitions.map(([d]) => [d, identity] as any),
    (_i, r) => Effect.succeed(r),
  )

  return ({ headers, body }: { headers: Headers; body: string }) =>
    handle(headers, body)
}
