#!/usr/bin/env bash
set -euo pipefail

direnv allow
corepack install
pnpm install

git clone https://github.com/effect-ts/effect-smol.git --depth 1 .repos/effect
