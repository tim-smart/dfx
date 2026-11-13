import { Discord, Ix } from "dfx"
import { Effect, type Option } from "effect"

it("types nested options when another subcommand has no options", () => {
  const command = Ix.global(
    {
      name: "command",
      description: "command description",
      options: [
        {
          type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
          name: "sub-1",
          description: "sub-1 description",
          options: [
            {
              type: Discord.ApplicationCommandOptionType.USER,
              name: "option-1",
              description: "option-1 value",
              required: true,
            },
          ],
        },
        {
          type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
          name: "sub-2",
          description: "sub-2 description",
        },
        {
          type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
          name: "sub-3",
          description: "sub-3 description",
          options: [],
        },
        {
          type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
          name: "sub-4",
          description: "sub-4 description",
          options: undefined,
        },
      ],
    },
    ix =>
      ix.subCommands({
        "sub-1": Effect.sync(() => {
          ix.optionValue("option-1") satisfies string
          ix.resolve("option-1", id => id) satisfies Option.Option<string>
          return Ix.response({ type: 4, data: { content: "ok" } })
        }),
        "sub-2": Effect.succeed(
          Ix.response({ type: 4, data: { content: "ok" } }),
        ),
        "sub-3": Effect.succeed(
          Ix.response({ type: 4, data: { content: "ok" } }),
        ),
        "sub-4": Effect.succeed(
          Ix.response({ type: 4, data: { content: "ok" } }),
        ),
      }),
  )

  expect(command).toBeDefined()
})

it("types conditionally included subcommand options", () => {
  const enabled = Boolean(true)
  const userOption = {
    type: Discord.ApplicationCommandOptionType.USER,
    name: "user",
    description: "user description",
  } as const
  const command = Ix.global(
    {
      name: "command",
      description: "command description",
      options: [
        {
          type: Discord.ApplicationCommandOptionType.SUB_COMMAND,
          name: "sub",
          description: "sub description",
          ...(enabled ? { options: [userOption] as const } : {}),
        },
      ],
    },
    ix =>
      Effect.sync(() => {
        ix.optionValueOptional("user") satisfies Option.Option<string>
        ix.resolve("user", id => id) satisfies Option.Option<string>
        return Ix.response({ type: 4, data: { content: "ok" } })
      }),
  )

  expect(command).toBeDefined()
})
