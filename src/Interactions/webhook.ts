import * as Verify from "discord-verify"
import * as D from "./definitions.js"
import { DefinitionNotFound, handlers } from "./handlers.js"
import { InteractionBuilder, Interaction } from "./index.js"
import * as Option from "@effect/data/Option"
import * as Effect from "@effect/io/Effect"

export class BadWebhookSignature {
  readonly _tag = "BadWebhookSignature"
}

export type Headers = Record<string, string | string[] | undefined>

const checkSignature = (
  publicKey: string,
  headers: Headers,
  body: string,
  crypto: SubtleCrypto,
  algorithm: any,
) =>
  Option.all({
    signature: Maybe.fromNullable(headers["x-signature-ed25519"]),
    timestamp: Maybe.fromNullable(headers["x-signature-timestamp"]),
  })
    .flatMap(_ =>
      Effect.promise(() =>
        Verify.verify(
          body,
          _.signature as string,
          _.timestamp as string,
          publicKey,
          crypto,
          algorithm,
        ),
      ),
    )
    .filterOrFail(identity, () => new BadWebhookSignature())
    .catchAllCause(() => Effect.fail(new BadWebhookSignature())).asUnit

export interface MakeConfigOpts {
  applicationId: string
  publicKey: ConfigSecret
  crypto: SubtleCrypto
  algorithm: keyof typeof Verify.PlatformAlgorithm
}
const makeConfig = ({
  applicationId,
  publicKey,
  crypto,
  algorithm,
}: MakeConfigOpts) => ({
  applicationId,
  publicKey: publicKey.value,
  crypto,
  algorithm: Verify.PlatformAlgorithm[algorithm],
})
export interface WebhookConfig extends ReturnType<typeof makeConfig> {}
export const WebhookConfig = Tag<WebhookConfig>()
export const makeConfigLayer = (opts: MakeConfigOpts) =>
  Layer.succeed(WebhookConfig, makeConfig(opts))
export const makeFromConfig = (a: Config<MakeConfigOpts>) =>
  Layer.effect(WebhookConfig, a.config.map(makeConfig))

export class WebhookParseError {
  readonly _tag = "WebhookParseError"
  constructor(readonly reason: unknown) {}
}

const fromHeadersAndBody = (headers: Headers, body: string) =>
  Do($ => {
    const { publicKey, crypto, algorithm } = $(
      WebhookConfig.accessWith(identity),
    )
    $(checkSignature(publicKey, headers, body, crypto, algorithm))
    return $(
      Effect.try({
        try: () => JSON.parse(body) as Discord.Interaction,
        catch: reason => new WebhookParseError(reason),
      }),
    )
  })

const run = <R, E>(
  definitions: Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (
        self: Effect.Effect<R, E, Discord.InteractionResponse>,
      ) => Effect.Effect<R, E, Discord.InteractionResponse>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect.Effect<R, E, Discord.InteractionResponse>,
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
  success: (a: Discord.InteractionResponse) => Effect.Effect<never, never, void>
  error: (e: Cause<E>) => Effect.Effect<never, never, void>
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
