import { Discord, Ix } from "dfx"
import { Effect } from "effect"
import { expectTypeOf } from "vitest"

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
              type: Discord.ApplicationCommandOptionType.STRING,
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
      ],
    },
    ix =>
      ix.subCommands({
        "sub-1": Effect.sync(() => {
          expectTypeOf(ix.optionValue("option-1")).toEqualTypeOf<string>()
          return Ix.response({ type: 4, data: { content: "ok" } })
        }),
        "sub-2": Effect.succeed(
          Ix.response({ type: 4, data: { content: "ok" } }),
        ),
      }),
  )

  expect(command).toBeDefined()
})
