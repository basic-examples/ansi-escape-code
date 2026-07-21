#!/bin/sh

set -e

rm -rf docs tmp
mkdir -p tmp/docs

for dir in packages/*; do
  pnpm --dir "$dir" exec typedoc --options typedoc.jsonc --json "../../tmp/docs/$(basename "$dir").json"
done

pnpm exec typedoc --options typedoc.jsonc --json tmp/docs/root.json

pnpm exec typedoc --options typedoc.root.jsonc

rm -rf tmp
