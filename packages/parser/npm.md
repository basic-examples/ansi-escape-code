# `@ansi-escape-code/parser`

ANSI Escape Code parser

Dependency-light SGR parser. For full CSI, OSC, DCS, ESC, and escaped-input
tooling, see [Ansicode](https://ansicode.eversources.app/en).

```ts
import { parseAnsiString } from "@ansi-escape-code/parser";

parseAnsiString("\x1b[31mred\x1b[0m");
```

[API Docs](https://basic-examples.github.io/ansi-escape-code) — hosted separately to reduce npm package size.
