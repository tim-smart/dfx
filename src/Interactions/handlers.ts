import type * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as IxHelpers from "dfx/Helpers/interactions"
import * as Ctx from "dfx/Interactions/context"
import type * as D from "dfx/Interactions/definitions"
import { flattenDefinitions, splitDefinitions } from "dfx/Interactions/utils"
import * as Discord from "dfx/types"
import type { Scope } from "effect/Scope"

export class DefinitionNotFound {
  readonly _tag = "DefinitionNotFound"
  constructor(readonly interaction: Discord.Interaction) {}
}

type Handler<R, E, A> = Effect.Effect<
  A,
  E | DefinitionNotFound,
  R | Ctx.DiscordInteraction
>

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
  (i: Discord.Interaction) => Handler<Exclude<R, Scope>, E, B>
> => {
  const flattened = flattenDefinitions(definitions, handleResponse)

  const { Autocomplete, Commands, MessageComponent, ModalSubmit } =
    splitDefinitions(flattened)

  return {
    [Discord.InteractionType.PING]: _ =>
      Effect.succeed({
        type: Discord.InteractionCallbackType.PONG,
      } as any),

    [Discord.InteractionType.APPLICATION_COMMAND]: i => {
      const data = i.data as Discord.ApplicationCommandDatum
      const command = Commands[data.name]
      if (command === undefined) {
        return Effect.fail(new DefinitionNotFound(i))
      }
      return Effect.provideService(
        command.handle(i),
        Ctx.ApplicationCommand,
        data,
      ) as Handler<Exclude<R, Scope>, E, B>
    },

    [Discord.InteractionType.MODAL_SUBMIT]: i => {
      const data = i.data as Discord.ModalSubmitDatum
      const match = ModalSubmit.find(_ => _.predicate(data.custom_id))
      if (match === undefined) {
        return Effect.fail(new DefinitionNotFound(i))
      }
      return Effect.provideService(
        match.handle(i),
        Ctx.ModalSubmitData,
        data,
      ) as Handler<Exclude<R, Scope>, E, B>
    },

    [Discord.InteractionType.MESSAGE_COMPONENT]: i => {
      const data = i.data as Discord.MessageComponentDatum
      const match = MessageComponent.find(_ => _.predicate(data.custom_id))
      if (match === undefined) {
        return Effect.fail(new DefinitionNotFound(i))
      }
      return Effect.provideService(
        match.handle(i),
        Ctx.MessageComponentData,
        data,
      ) as Handler<Exclude<R, Scope>, E, B>
    },

    [Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE]: i => {
      const data = i.data as Discord.ApplicationCommandDatum
      const option = IxHelpers.focusedOption(data)
      if (option._tag === "None") {
        return Effect.fail(new DefinitionNotFound(i))
      }
      const match = Autocomplete.find(_ => _.predicate(data, option.value))
      if (match === undefined) {
        return Effect.fail(new DefinitionNotFound(i))
      }
      return match
        .handle(i)
        .pipe(
          Effect.provideService(Ctx.ApplicationCommand, data),
          Effect.provideService(Ctx.FocusedOptionContext, option.value),
        ) as Handler<Exclude<R, Scope>, E, B>
    },
  }
}
