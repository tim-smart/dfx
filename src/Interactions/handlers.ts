import * as IxHelpers from "dfx/Helpers/interactions"
import * as Ctx from "./context.js"
import * as D from "./definitions.js"
import { flattenDefinitions, splitDefinitions } from "./utils.js"

export class DefinitionNotFound {
  readonly _tag = "DefinitionNotFound"
  constructor(readonly interaction: Discord.Interaction) {}
}

type Handler<R, E, A> = Effect<
  R | Discord.Interaction,
  E | DefinitionNotFound,
  A
>

export const handlers = <R, E, TE, A, B>(
  definitions: Chunk<
    readonly [
      handler: D.InteractionDefinition<R, E>,
      transform: (self: Effect<R, E, A>) => Effect<R, TE, B>,
    ]
  >,
  handleResponse: (
    ix: Discord.Interaction,
    _: Discord.InteractionResponse,
  ) => Effect<R, E, A>,
): Record<
  Discord.InteractionType,
  (i: Discord.Interaction) => Handler<R, E, B>
> => {
  const flattened = flattenDefinitions(definitions, handleResponse)

  const { Commands, Autocomplete, MessageComponent, ModalSubmit } =
    splitDefinitions(flattened)

  return {
    [Discord.InteractionType.PING]: () =>
      Effect.succeed({
        type: Discord.InteractionCallbackType.PONG,
      } as any),

    [Discord.InteractionType.APPLICATION_COMMAND]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return Maybe.fromNullable(Commands[data.name]).match(
        () => Effect.fail(new DefinitionNotFound(i)),
        command =>
          command
            .handle(i)
            .provideService(Ctx.ApplicationCommand, data) as Handler<R, E, B>,
      )
    },

    [Discord.InteractionType.MODAL_SUBMIT]: i => {
      const data = i.data as Discord.ModalSubmitDatum

      return ModalSubmit.find(_ => _.predicate(data.custom_id)).flatMap(_ =>
        _.match(
          () => Effect.fail(new DefinitionNotFound(i)),
          match =>
            match
              .handle(i)
              .provideService(Ctx.ModalSubmitData, data) as Handler<R, E, B>,
        ),
      )
    },

    [Discord.InteractionType.MESSAGE_COMPONENT]: i => {
      const data = i.data as Discord.MessageComponentDatum

      return MessageComponent.find(_ => _.predicate(data.custom_id)).flatMap(
        _ =>
          _.match(
            () => Effect.fail(new DefinitionNotFound(i)),
            match =>
              match
                .handle(i)
                .provideService(Ctx.MessageComponentData, data) as Handler<
                R,
                E,
                B
              >,
          ),
      )
    },

    [Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return IxHelpers.focusedOption(data).match(
        () => Effect.fail(new DefinitionNotFound(i)),
        focusedOption =>
          Autocomplete.find(_ => _.predicate(data, focusedOption)).flatMap(_ =>
            _.match(
              () => Effect.fail(new DefinitionNotFound(i)),
              match =>
                match
                  .handle(i)
                  .provideService(Ctx.ApplicationCommand, data)
                  .provideService(Ctx.FocusedOptionContext, {
                    focusedOption,
                  }) as Handler<R, E, B>,
            ),
          ),
      )
    },
  }
}
