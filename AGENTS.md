# Project guide for agents

This repository is for npm `ansi-escape-code` and `@ansi-escape-code/*` packages.

## Project structure

- `packages/`: subpackages under `@ansi-escape-code/*`
  - (name): directory per subpackage
    - `src/`: source code
    - `README.md`: document for typedoc
    - `npm.md`: README.md for npm
    - `typedoc.jsonc`: typedoc config
- `src/`: main package (`ansi-escape-code`) source code
- `README.md`: main package document for typedoc
- `npm.md`: main package README.md for npm
- `typedoc.jsonc`: main package typedoc config
- `typedoc.root.jsonc`: root typedoc config
- `typedoc.md`: root typedoc README.md
