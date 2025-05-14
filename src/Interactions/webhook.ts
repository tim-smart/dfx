import * as Chunk from "effect/Chunk"
import { GenericTag } from "effect/Context"
import { identity } from "effect/Function"
import * as Option from "effect/Option"
import type * as Cause from "effect/Cause"
import type * as Config from "effect/Config"
import type * as ConfigError from "effect/ConfigError"
import * as Redacted from "effect/Redacted"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type * as D from "dfx/Interactions/definitions"
import type { DefinitionNotFound } from "dfx/Interactions/handlers"
import { handlers } from "dfx/Interactions/handlers"
import type {
  DiscordInteraction,
  InteractionBuilder,
} from "dfx/Interactions/index"
import { Interaction } from "dfx/Interactions/index"
import type * as Discord from "dfx/types"
import * as Verify from "discord-verify"
import { TypeIdError } from "@effect/platform/Error"
import { InteractionsErrorTypeId } from "dfx/Interactions/error"

export class BadWebhookSignature {
  readonly _tag = "BadWebhookSignature"
}

export type Headers = Record<string, string | Array<string> | undefined>

const checkSignature = (
  publicKey: string,
  headers: Headers,
  body: string,
  crypto: SubtleCrypto,
  algorithm: any,
) =>
  Option.all({
    signature: Option.fromNullable(headers["x-signature-ed25519"]),
    timestamp: Option.fromNullable(headers["x-signature-timestamp"]),
  }).pipe(
    Effect.flatMap(_ =>
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
    ),
    Effect.filterOrFail(identity, () => new BadWebhookSignature()),
    Effect.catchAllCause(() => Effect.fail(new BadWebhookSignature())),
    Effect.asVoid,
  )

export interface MakeConfigOpts {
  readonly applicationId: string
  readonly publicKey: Redacted.Redacted
  readonly crypto: SubtleCrypto
  readonly algorithm: keyof typeof Verify.PlatformAlgorithm
}
const makeConfig = ({
  algorithm,
  applicationId,
  crypto,
  publicKey,
}: MakeConfigOpts) => ({
  applicationId,
  publicKey: Redacted.value(publicKey),
  crypto,
  algorithm: Verify.PlatformAlgorithm[algorithm],
})

export interface WebhookConfig {
  readonly _: unique symbol
}
export const WebhookConfig = GenericTag<
  WebhookConfig,
  ReturnType<typeof makeConfig>
>("dfx/Interactions/WebhookConfig")

export const layer = (opts: MakeConfigOpts) =>
  Layer.succeed(WebhookConfig, makeConfig(opts))

export const layerConfig: (
  config: Config.Config<MakeConfigOpts>,
) => Layer.Layer<WebhookConfig, ConfigError.ConfigError> = (
  config: Config.Config<MakeConfigOpts>,
) => Layer.effect(WebhookConfig, Effect.map(config, makeConfig))

export class WebhookParseError extends TypeIdError(
  InteractionsErrorTypeId,
  "WebhookParseError",
)<{ cause: unknown }> {}

const fromHeadersAndBody = (headers: Headers, body: string) =>
  Effect.tap(WebhookConfig, ({ algorithm, crypto, publicKey }) =>
    checkSignature(publicKey, headers, body, crypto, algorithm),
  ).pipe(
    Effect.flatMap(() =>
      Effect.try({
        try: () => JSON.parse(body) as Discord.APIInteraction,
        catch: cause => new WebhookParseError({ cause }),
      }),
    ),
  )

const run = <R, E>(
  definitions: Chunk.Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (
        self: Effect.Effect<Discord.CreateInteractionResponseRequest, E, R>,
      ) => Effect.Effect<Discord.CreateInteractionResponseRequest, E, R>,
    ]
  >,
  handleResponse: (
    ix: Discord.APIInteraction,
    _: Discord.CreateInteractionResponseRequest,
  ) => Effect.Effect<Discord.CreateInteractionResponseRequest, E, R>,
) => {
  const handler = handlers(definitions, handleResponse)
  return (
    headers: Headers,
    body: string,
  ): Effect.Effect<
    Discord.CreateInteractionResponseRequest,
    BadWebhookSignature | WebhookParseError | E | DefinitionNotFound,
    WebhookConfig | Exclude<R, DiscordInteraction>
  > =>
    Effect.flatMap(fromHeadersAndBody(headers, body), interaction =>
      Effect.withSpan(
        Effect.provideService(
          handler[interaction.type](interaction),
          Interaction,
          interaction,
        ),
        "dfx.Interaction",
        {
          attributes: { interactionId: interaction.id },
          captureStackTrace: false,
        },
      ),
    )
}

export interface HandleWebhookOpts<E> {
  headers: Headers
  body: string
  success: (a: Discord.CreateInteractionResponseRequest) => Effect.Effect<void>
  error: (e: Cause.Cause<E>) => Effect.Effect<void>
}

/**
 * @tsplus getter dfx/InteractionBuilder webhookHandler
 */
export const makeHandler = <R, E, TE>(
  ix: InteractionBuilder<R, E, TE>,
): (({
  body,
  error,
  headers,
  success,
}: HandleWebhookOpts<
  E | WebhookParseError | BadWebhookSignature | DefinitionNotFound
>) => Effect.Effect<void, never, WebhookConfig>) => {
  const handle = run(
    Chunk.map(ix.definitions, ([d]) => [d, identity] as any),
    (_i, r) => Effect.succeed(r),
  )

  return ({
    body,
    error,
    headers,
    success,
  }: HandleWebhookOpts<
    E | WebhookParseError | BadWebhookSignature | DefinitionNotFound
  >): Effect.Effect<void, never, WebhookConfig> =>
    handle(headers, body).pipe(
      Effect.flatMap(success),
      Effect.catchAllCause(error),
    )
}

/**
 * @tsplus getter dfx/InteractionBuilder simpleWebhookHandler
 */
export const makeSimpleHandler = <R, E, TE>(
  ix: InteractionBuilder<R, E, TE>,
): (({
  body,
  headers,
}: {
  headers: Headers
  body: string
}) => Effect.Effect<
  Discord.CreateInteractionResponseRequest,
  BadWebhookSignature | WebhookParseError | DefinitionNotFound,
  WebhookConfig
>) => {
  const handle = run(
    Chunk.map(ix.definitions, ([d]) => [d, identity] as any),
    (_i, r) => Effect.succeed(r),
  )

  return ({ body, headers }: { headers: Headers; body: string }) =>
    handle(headers, body)
}
