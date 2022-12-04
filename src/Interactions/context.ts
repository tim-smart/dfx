export type InteractionResponse =
  | {
      type: Discord.InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE
      data: Discord.InteractionCallbackMessage
    }
  | {
      type: Discord.InteractionCallbackType.UPDATE_MESSAGE
      data: Discord.InteractionCallbackMessage
    }
  | {
      type: Discord.InteractionCallbackType.MODAL
      data: Discord.InteractionCallbackModal
    }
  | {
      type: Discord.InteractionCallbackType.DEFERRED_UPDATE_MESSAGE
    }
  | {
      type: Discord.InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
    }
  | {
      type: Discord.InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
      data: Discord.InteractionCallbackAutocomplete
    }

export const InteractionContext = Tag<Discord.Interaction>()
export const ApplicationCommandContext = Tag<Discord.ApplicationCommandDatum>()
export const MessageComponentContext = Tag<Discord.MessageComponentDatum>()
export const ModalSubmitContext = Tag<Discord.ModalSubmitDatum>()
export const FocusedOptionContext =
  Tag<Discord.ApplicationCommandInteractionDataOption>()

export interface SubCommandContext {
  readonly command: Discord.ApplicationCommandInteractionDataOption
}
export const SubCommandContext = Tag<SubCommandContext>()

export const respond = (response: InteractionResponse) =>
  Do(($) => {
    const { id, token } = $(Effect.service(InteractionContext))
    return $(Rest.rest.createInteractionResponse(id, token, response))
  }).asUnit

export const focusedOptionValue = Effect.serviceWith(FocusedOptionContext)(
  (a) => a.value!,
)

export const commandOptionsMap = Effect.serviceWith(ApplicationCommandContext)(
  IxHelpers.optionsMap,
)

export const handleSubCommand = <R, E>(
  name: string,
  handle: Effect<R, E, void>,
) =>
  Effect.serviceWithEffect(ApplicationCommandContext)((a) =>
    IxHelpers.findSubCommand(name)(a).match(Effect.unit, (command) =>
      pipe(handle, Effect.provideService(SubCommandContext)({ command })),
    ),
  )

export const getSubCommand = Effect.serviceWith(SubCommandContext)(
  (a) => a.command,
)

export const subCommandOptionsMap = getSubCommand.map(IxHelpers.optionsMap)

export const modalValues = Effect.serviceWith(ModalSubmitContext)(
  IxHelpers.componentsMap,
)
