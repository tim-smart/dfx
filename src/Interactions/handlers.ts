import type * as Chunk from "effect/Chunk"
import * as Option from "effect/Option"
import * as Effect from "effect/Effect"
import * as IxHelpers from "dfx/Helpers/interactions"
import * as Ctx from "dfx/Interactions/context"
import type * as D from "dfx/Interactions/definitions"
import { flattenDefinitions, splitDefinitions } from "dfx/Interactions/utils"
import * as Discord from "dfx/types"

export class DefinitionNotFound {
  readonly _tag = "DefinitionNotFound"
  constructor(readonly interaction: Discord.Interaction) {}
}

type Handler<R, E, A> = Effect.Effect<A, E | DefinitionNotFound, R | Ctx.DiscordInteraction>

export const handlers = <R, E, TE, A, B>(
  definitions: Chunk.Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect.Effect<A, E, R>) => Effect.Effect<B, TE, R>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect.Effect<A, E, R>,
): Record<
  Discord.InteractionType,
  (i: Discord.Interaction) => Handler<R, E, B>
> => {
  const flattened = flattenDefinitions(definitions, handleResponse)

  const { Autocomplete, Commands, MessageComponent, ModalSubmit } =
    splitDefinitions(flattened)

  return {
    [Discord.InteractionType.PING]: () =>
      Effect.succeed({
        type: Discord.InteractionCallbackType.PONG,
      } as any),

    [Discord.InteractionType.APPLICATION_COMMAND]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return Option.match(Option.fromNullable(Commands[data.name]), {
        onNone: () => Effect.fail(new DefinitionNotFound(i)),
        onSome: command =>
          Effect.provideService(
            command.handle(i),
            Ctx.ApplicationCommand,
            data,
          ) as Handler<R, E, B>,
      })
    },

    [Discord.InteractionType.MODAL_SUBMIT]: i => {
      const data = i.data as Discord.ModalSubmitDatum

      return Effect.findFirst(ModalSubmit, _ =>
        _.predicate(data.custom_id),
      ).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () => Effect.fail(new DefinitionNotFound(i)),
            onSome: match =>
              Effect.provideService(
                match.handle(i),
                Ctx.ModalSubmitData,
                data,
              ) as Handler<R, E, B>,
          }),
        ),
      )
    },

    [Discord.InteractionType.MESSAGE_COMPONENT]: i => {
      const data = i.data as Discord.MessageComponentDatum

      return Effect.findFirst(MessageComponent, _ =>
        _.predicate(data.custom_id),
      ).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () => Effect.fail(new DefinitionNotFound(i)),
            onSome: match =>
              Effect.provideService(
                match.handle(i),
                Ctx.MessageComponentData,
                data,
              ) as Handler<R, E, B>,
          }),
        ),
      )
    },

    [Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return Option.match(IxHelpers.focusedOption(data), {
        onNone: () => Effect.fail(new DefinitionNotFound(i)),
        onSome: focusedOption =>
          Effect.findFirst(Autocomplete, _ =>
            _.predicate(data, focusedOption),
          ).pipe(
            Effect.flatMap(
              Option.match({
                onNone: () => Effect.fail(new DefinitionNotFound(i)),
                onSome: match =>
                  Effect.provideService(
                    match.handle(i),
                    Ctx.ApplicationCommand,
                    data,
                  ).pipe(
                    Effect.provideService(Ctx.FocusedOptionContext, {
                      focusedOption,
                    }),
                  ) as Handler<R, E, B>,
              }),
            ),
          ),
      })
    },
  }
}
