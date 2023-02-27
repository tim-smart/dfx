import * as Arr from "@effect/data/ReadonlyArray"
import * as Ctx from "./context.js"
import * as D from "./definitions.js"
import { splitDefinitions } from "./utils.js"

export class DefinitionNotFound {
  readonly _tag = "DefinitionNotFound"
  constructor(readonly interaction: Discord.Interaction) {}
}

type Handler<R, E> = Effect<
  R | Discord.Interaction,
  E | DefinitionNotFound,
  Discord.InteractionResponse
>

const context: D.CommandHelper<any> = {
  resolve: Ctx.resolved,
  option: Ctx.option,
  optionValue: Ctx.optionValue,
  optionValueOptional: Ctx.optionValueOptional,
  subCommands: Ctx.handleSubCommands,
} as any

export const handlers = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
): Record<
  Discord.InteractionType,
  (i: Discord.Interaction) => Handler<R, E>
> => {
  const { Commands, Autocomplete, MessageComponent, ModalSubmit } =
    splitDefinitions(definitions)

  return {
    [Discord.InteractionType.PING]: () =>
      Effect.succeed({
        type: Discord.InteractionCallbackType.PONG,
      } as any),

    [Discord.InteractionType.APPLICATION_COMMAND]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return Maybe.fromNullable(Commands[data.name])
        .match(
          () => Effect.fail(new DefinitionNotFound(i)) as Handler<R, E>,
          command =>
            Effect.isEffect(command.handle)
              ? command.handle
              : command.handle(context),
        )
        .provideService(Ctx.ApplicationCommandContext, data)
    },

    [Discord.InteractionType.MODAL_SUBMIT]: (i: Discord.Interaction) => {
      const data = i.data as Discord.ModalSubmitDatum

      return pipe(
        ModalSubmit,
        Arr.map(a =>
          Effect.struct({
            command: Effect.succeed(a),
            match: a.predicate(data.custom_id),
          }),
        ),
        _ =>
          _.collectAllPar
            .flatMap(a =>
              a
                .findFirst(a => a.match)
                .match(
                  () => Effect.fail(new DefinitionNotFound(i)) as Handler<R, E>,
                  a => a.command.handle,
                ),
            )
            .provideService(Ctx.ModalSubmitContext, data),
      )
    },

    [Discord.InteractionType.MESSAGE_COMPONENT]: i => {
      const data = i.data as Discord.MessageComponentDatum

      return pipe(
        MessageComponent,
        Arr.map(a =>
          Effect.struct({
            command: Effect.succeed(a),
            match: a.predicate(data.custom_id),
          }),
        ),
        a =>
          a.collectAllPar
            .flatMap(a =>
              a
                .findFirst(a => a.match)
                .match(
                  () => Effect.fail(new DefinitionNotFound(i)) as Handler<R, E>,
                  a => a.command.handle,
                ),
            )
            .provideService(Ctx.MessageComponentContext, data),
      )
    },

    [Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE]: i => {
      const data = i.data as Discord.ApplicationCommandDatum

      return IxHelpers.focusedOption(data)
        .map(focusedOption =>
          pipe(
            Autocomplete,
            Arr.map(_ =>
              Effect.struct({
                command: Effect.succeed(_),
                match: _.predicate(data, focusedOption),
              }),
            ),
            a =>
              a.collectAllPar
                .flatMap(_ =>
                  _.findFirst(_ => _.match).match(
                    () =>
                      Effect.fail(new DefinitionNotFound(i)) as Handler<R, E>,
                    _ => _.command.handle,
                  ),
                )
                .provideService(Ctx.ApplicationCommandContext, data)
                .provideService(Ctx.FocusedOptionContext, { focusedOption }),
          ),
        )
        .getOrElse(() => Effect.fail(new DefinitionNotFound(i)))
    },
  }
}
