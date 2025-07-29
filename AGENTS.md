# Project guide for agents

This repository is for npm `ansi-escape-code` and `@ansi-escape-code/*` packages.

## Project structure

- `packages/`: subpackages under `@ansi-escape-code/*`
  - (name): directory per subpackage
    - `src/`: source code
    - `README.md`: document for typedoc
    - `npm.md`: README.md for npm
    - `typedoc.json`: typedoc config
- `src/`: main package (`ansi-escape-code`) source code
- `README.md`: main package document for typedoc
- `npm.md`: main package README.md for npm
- `typedoc.json`: main package typedoc config
- `typedoc.root.json`: root typedoc config
- `typedoc.root.md`: root typedoc README.md
