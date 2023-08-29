import * as Chunk from "@effect/data/Chunk"
import { Tag } from "@effect/data/Context"
import { identity } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import type * as Cause from "@effect/io/Cause"
import type * as Config from "@effect/io/Config"
import type * as ConfigError from "@effect/io/Config/Error"
import * as ConfigSecret from "@effect/io/Config/Secret"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import type * as D from "dfx/Interactions/definitions"
import type { DefinitionNotFound } from "dfx/Interactions/handlers"
import { handlers } from "dfx/Interactions/handlers"
import type { InteractionBuilder } from "dfx/Interactions/index"
import { Interaction } from "dfx/Interactions/index"
import type * as Discord from "dfx/types"
import * as Verify from "discord-verify"

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
    Effect.asUnit,
  )

export interface MakeConfigOpts {
  readonly applicationId: string
  readonly publicKey: ConfigSecret.ConfigSecret
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
  publicKey: ConfigSecret.value(publicKey),
  crypto,
  algorithm: Verify.PlatformAlgorithm[algorithm],
})

export interface WebhookConfig extends ReturnType<typeof makeConfig> {}
export const WebhookConfig = Tag<WebhookConfig>()

export const makeConfigLayer = (opts: MakeConfigOpts) =>
  Layer.succeed(WebhookConfig, makeConfig(opts))

export const makeFromConfig: (
  a: Config.Config<MakeConfigOpts>,
) => Layer.Layer<never, ConfigError.ConfigError, WebhookConfig> = (
  a: Config.Config<MakeConfigOpts>,
) => Layer.effect(WebhookConfig, Effect.map(Effect.config(a), makeConfig))

export class WebhookParseError {
  readonly _tag = "WebhookParseError"
  constructor(readonly reason: unknown) {}
}

const fromHeadersAndBody = (headers: Headers, body: string) =>
  Effect.tap(WebhookConfig, ({ algorithm, crypto, publicKey }) =>
    checkSignature(publicKey, headers, body, crypto, algorithm),
  ).pipe(
    Effect.flatMap(() =>
      Effect.try({
        try: () => JSON.parse(body) as Discord.Interaction,
        catch: reason => new WebhookParseError(reason),
      }),
    ),
  )

const run = <R, E>(
  definitions: Chunk.Chunk<
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
    Effect.flatMap(fromHeadersAndBody(headers, body), interaction =>
      Effect.provideService(
        handler[interaction.type](interaction),
        Interaction,
        interaction,
      ),
    )
}

export interface HandleWebhookOpts<E> {
  headers: Headers
  body: string
  success: (a: Discord.InteractionResponse) => Effect.Effect<never, never, void>
  error: (e: Cause.Cause<E>) => Effect.Effect<never, never, void>
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
>) => Effect.Effect<WebhookConfig, never, void>) => {
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
  >): Effect.Effect<WebhookConfig, never, void> =>
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
  WebhookConfig,
  BadWebhookSignature | WebhookParseError | DefinitionNotFound,
  Discord.InteractionResponse
>) => {
  const handle = run(
    Chunk.map(ix.definitions, ([d]) => [d, identity] as any),
    (_i, r) => Effect.succeed(r),
  )

  return ({ body, headers }: { headers: Headers; body: string }) =>
    handle(headers, body)
}
