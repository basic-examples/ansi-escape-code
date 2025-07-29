#!/bin/sh

set -e

rm -rf docs tmp
mkdir -p tmp/docs

for dir in packages/*; do
  (cd "$dir" && npm install && npx typedoc --options typedoc.jsonc --json "../../tmp/docs/$(basename "$dir").json")
done

npm install
npx typedoc --options typedoc.jsonc --json tmp/docs/root.json

npx typedoc --options typedoc.root.jsonc

rm -rf tmp
