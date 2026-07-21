# `@ansi-escape-code/parser`

Dependency-light utilities for parsing SGR styling sequences.

```ts
import { parseAnsiString } from "@ansi-escape-code/parser";

const result = parseAnsiString("\x1b[1;31mError\x1b[0m");
```

This package intentionally remains focused on SGR styling. For CSI, OSC, DCS,
ESC, cursor controls, and interactive decoding, see
[Ansicode](https://ansicode.eversources.app/en).
