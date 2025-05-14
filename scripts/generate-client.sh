#!/bin/bash

mkdir -p tmp
curl https://raw.githubusercontent.com/discord/discord-api-spec/refs/heads/main/specs/openapi.json -o tmp/openapi.json
pnpm openapi-gen -t -n DiscordRest -s tmp/openapi.json > src/DiscordREST/Generated.ts

echo "/* eslint-disable */
$(cat src/DiscordREST/Generated.ts)" > src/DiscordREST/Generated.ts

pnpm prettier -w src/DiscordREST/Generated.ts
