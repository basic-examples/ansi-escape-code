# `ansi-escape-code`

A simple, fully typed ANSI text-styling library with an ergonomic, chainable DSL.

- Inner styles restore their surrounding styles for predictable composition.
- Works without `Proxy` or tagged-template syntax when necessary.
- Provides Node.js entry points with automatic non-TTY handling and custom inspection.

## Install

```sh
npm i ansi-escape-code

# TypeScript projects
npm i -D @ansi-escape-code/type
```

## Usage

Use the Proxy entry point for the chainable DSL:

```ts
import { ansi } from "ansi-escape-code/proxy";

console.log(ansi.red.bold`Error`.toString());
console.log(`${ansi.red`Hello ${ansi.bold.green`Beautiful`} World`}`);

const errorName = ansi.red.bold;

function formatError(ruleName: string, message: string): string {
  return `${errorName(`RULE-${ruleName}`)}: ${message}`;
}
```

Use `ansi-escape-code/proxy-node` for Node.js-specific non-TTY handling and custom inspection.

## Documentation

See the [generated TypeDoc documentation](https://basic-examples.github.io/ansi-escape-code/) for the complete API reference, exported types, entry points, and behavior details.

## License

MIT
