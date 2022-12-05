import * as Ctx from "./context.js"
import * as D from "./definitions.js"
import * as Arr from "@fp-ts/data/ReadonlyArray"
import { splitDefinitions } from "./utils.js"

export class InteractionNotFound {
  readonly _tag = "InteractionNotFound"
  constructor(readonly interaction: Discord.Interaction) {}
}

export const handlers = <R, E>(
  definitions: D.InteractionDefinition<R, E>[],
): Record<
  Discord.InteractionType,
  (i: Discord.Interaction) => Effect<R, E, Discord.InteractionResponse>
> => {
  const { allCommands, autocompletes, messageComponents, modalSubmits } =
    splitDefinitions(definitions)

  return {
    [Discord.InteractionType.PING]: () =>
      Effect.succeed({
        type: Discord.InteractionCallbackType.PONG,
      }),

    [Discord.InteractionType.APPLICATION_COMMAND]: (i) => {
      const data = i.data as Discord.ApplicationCommandDatum

      return pipe(
        Maybe.fromNullable(allCommands[data.name]).match(
          () =>
            Effect.fail(new InteractionNotFound(i)) as any as Effect<
              R,
              E,
              Discord.InteractionResponse
            >,
          (command) => command.handle,
        ),
        Effect.provideService(Ctx.InteractionContext)(i),
        Effect.provideService(Ctx.ApplicationCommandContext)(data),
      )
    },

    [Discord.InteractionType.MODAL_SUBMIT]: (i: Discord.Interaction) => {
      const data = i.data as Discord.ModalSubmitDatum

      return pipe(
        modalSubmits,
        Arr.map((a) =>
          Effect.struct({
            command: Effect.succeed(a),
            match: a.predicate(data.custom_id),
          }),
        ),
        (a) =>
          a.collectAllPar.flatMap((a) =>
            a
              .findFirst((a) => a.match)
              .match(
                () =>
                  Effect.fail(new InteractionNotFound(i)) as any as Effect<
                    R,
                    E,
                    Discord.InteractionResponse
                  >,
                (a) => a.command.handle,
              ),
          ),
        Effect.provideService(Ctx.InteractionContext)(i),
        Effect.provideService(Ctx.ModalSubmitContext)(data),
      )
    },

    [Discord.InteractionType.MESSAGE_COMPONENT]: (i) => {
      const data = i.data as Discord.MessageComponentDatum

      return pipe(
        messageComponents,
        Arr.map((a) =>
          Effect.struct({
            command: Effect.succeed(a),
            match: a.predicate(data.custom_id),
          }),
        ),
        (a) =>
          a.collectAllPar.flatMap((a) =>
            a
              .findFirst((a) => a.match)
              .match(
                () =>
                  Effect.fail(new InteractionNotFound(i)) as any as Effect<
                    R,
                    E,
                    Discord.InteractionResponse
                  >,
                (a) => a.command.handle,
              ),
          ),
        Effect.provideService(Ctx.InteractionContext)(i),
        Effect.provideService(Ctx.MessageComponentContext)(data),
      )
    },

    [Discord.InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE]: (i) => {
      const data = i.data as Discord.ApplicationCommandDatum

      return IxHelpers.focusedOption(data)
        .map((focusedOption) =>
          pipe(
            autocompletes,
            Arr.map((a) =>
              Effect.struct({
                command: Effect.succeed(a),
                match: a.predicate(focusedOption),
              }),
            ),
            (a) =>
              a.collectAllPar.flatMap((a) =>
                a
                  .findFirst((a) => a.match)
                  .match(
                    () =>
                      Effect.fail(new InteractionNotFound(i)) as any as Effect<
                        R,
                        E,
                        Discord.InteractionResponse
                      >,
                    (a) => a.command.handle,
                  ),
              ),
            Effect.provideService(Ctx.InteractionContext)(i),
            Effect.provideService(Ctx.ApplicationCommandContext)(data),
            Effect.provideService(Ctx.FocusedOptionContext)({ focusedOption }),
          ),
        )
        .getOrElse(() => Effect.fail(new InteractionNotFound(i)) as any)
    },
  }
}
