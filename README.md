# `ansi-escape-code`

Effortless, fully nestable ANSI styling — with both a tiny class-based core **and** a super-ergonomic `Proxy` interface.

```js
import { ansi } from "ansi-escape-code/proxy";

console.log(ansi.red`Hello ${ansi.green.bold`Beautiful`} World`.toString());
```

…or, if your environment does **not** support `Proxy`:

```js
import { Ansi } from "ansi-escape-code";

console.log(
  Ansi.tt({ foregroundColor: Ansi.STANDARD_RED })`Hello ${Ansi.tt({
    foregroundColor: Ansi.STANDARD_GREEN,
    weight: "bold",
  })`Beautiful`} World`.toString()
);
```

## Table of contents

* [Why this library?](#why-this-library)
* [Install](#install)
* [Quick start](#quick-start)
  * [With `Proxy` (recommended)](#with-proxy-recommended)
  * [Without `Proxy`](#without-proxy)
* [TTY-aware entry points](#tty-aware-entry-points)
* [API Reference](#api-reference)
  * [`Ansi` class](#ansi-class)
    * [`AnsiOptions`](#ansioptions)
    * `Ansi.defaultOptions`
    * Color constants & helpers
    * `Ansi.tt(options): AnsiTemplateTag`
    * `toString(resolvedOuterOptions?: AnsiOptions): string`
  * [`ansi` (Proxy factory)](#ansi-proxy-factory)
    * `AnsiFactory` surface
  * [`NoopAnsi`](#noopansi)
* [Advanced: nesting & option resolution](#advanced-nesting--option-resolution)
* [TypeScript types](#typescript-types)
* [FAQ](#faq)
* [License](#license)

## Why this library?

* **True nesting**: Inner styles override just what they change; outer styles are restored automatically.
* **Zero surprises**: Explicit `toString()` — you choose when to emit escape codes.
* **Type-safe**: Clear typings for colors, options, and template tags.
* **Works everywhere**: Use the ergonomic `Proxy` API where supported, or fall back to the class-based API.
* **TTY-aware entry points**: Automatically strip codes when writing to non-TTY streams (Node.js).

## Install

```sh
npm i ansi-escape-code

# if you use typescript
npm i -D @ansi-escape-code/type
```

## Quick start

### With `Proxy` (recommended)

```ts
import { ansi } from "ansi-escape-code/proxy";

console.log(
  ansi.red.bold`Error:`.toString(),
  ansi.yellow` something went wrong`.toString()
);
```

Chaining works exactly as you expect:

```ts
console.log(
  ansi.green.double_underline`important`.toString()
);
```

Dynamic colors:

```ts
console.log(
  ansi.color(Ansi.TRUE_COLOR(255, 128, 0)).bold`🔥 Hot!`.toString()
);
```

### Without `Proxy`

Use the low-level, fully typed `Ansi` class.

```ts
import { Ansi } from "ansi-escape-code";

const red = Ansi.tt({ foregroundColor: Ansi.STANDARD_RED });
const greenBold = Ansi.tt({
  foregroundColor: Ansi.STANDARD_GREEN,
  weight: "bold",
});

const out = red`Hello ${greenBold`Beautiful`} World`.toString();
console.log(out);
```

## TTY-aware entry points

Most CLIs should **avoid** emitting escape codes when the destination stream **is not** a TTY. Use these:

* `ansi-escape-code/node`
* `ansi-escape-code/proxy-node`

They behave like their counterparts but will return `NoopAnsi` wrappers (or similar behavior) when `process.stdout.isTTY` or `process.stderr.isTTY` is false.

## API Reference

### `Ansi` class

```ts
export declare class Ansi {
  readonly options: Partial<AnsiOptions>;
  static readonly defaultOptions: AnsiOptions;
  readonly parts: AnsiPart[];

  constructor(options: Partial<AnsiOptions>, ...parts: AnsiPart[]);

  toString(resolvedOuterOptions?: AnsiOptions): string;

  static GRAYSCALE(n: number): AnsiColor;
  static BASIC_RGB(r: number, g: number, b: number): AnsiColor;
  static TRUE_COLOR(r: number, g: number, b: number): AnsiColor;

  static tt(options: Partial<AnsiOptions>): AnsiTemplateTag;

  // Standard color constants (see below)
  static readonly STANDARD_BLACK: AnsiColor;
  static readonly STANDARD_RED: AnsiColor;
  ...
  static readonly INTENSE_WHITE: AnsiColor;
}
```

#### `AnsiOptions`

```ts
export interface AnsiOptions {
  weight: "normal" | "bold" | "dim";
  italic: boolean;
  underline: "none" | "single" | "double";
  blink: boolean;
  strike: boolean;
  overline: boolean;
  reverse: boolean;
  underlineColor: AnsiColor;
  foregroundColor: AnsiColor;
  backgroundColor: AnsiColor;
}
```

* All options are **overridable** at any depth of nesting.
* Instances store **partial** options; unspecified fields inherit from their parent.

#### `Ansi.defaultOptions`

A concrete `AnsiOptions` object providing library defaults (e.g., no formatting, default colors). You can pass it if you need to control the top-most defaults.

#### Color constants & helpers

Predefined color constants:

* `Ansi.STANDARD_*`: BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE
* `Ansi.INTENSE_*`: same 8 colors, high-intensity versions

Programmatic helpers:

* `Ansi.GRAYSCALE(n: number)` – *n* ∈ \[0..23]
* `Ansi.BASIC_RGB(r: number, g: number, b: number)` – each ∈ \[0..5]
* `Ansi.TRUE_COLOR(r: number, g: number, b: number)` – each ∈ \[0..255]

All return an `AnsiColor`.

#### `Ansi.tt(options: Partial<AnsiOptions>): AnsiTemplateTag`

Creates a **template tag** pre-configured with options:

```ts
const red = Ansi.tt({ foregroundColor: Ansi.STANDARD_RED });
const boldGreen = Ansi.tt({
  weight: "bold",
  foregroundColor: Ansi.STANDARD_GREEN,
});

console.log(red`Hello ${boldGreen`World`}`.toString());
```

#### `toString(resolvedOuterOptions?: AnsiOptions): string`

Returns a final string (with or without escape codes, depending on the implementation you’re using). Pass `resolvedOuterOptions` if you want to control the **outer** baseline (e.g., already-applied styles).

### `ansi` (Proxy factory)

```ts
import { ansi } from "ansi-escape-code/proxy";
```

`ansi` is both:

* a **template tag**: `` ansi.bold.red`...strings` ``
* a **chainable factory**: `ansi.color(...).backgroundColor(...).underlineColor(...)...`

`type AnsiTT = AnsiFactory & AnsiTemplateTag`.

#### `AnsiFactory` surface

All of these return another `AnsiTT`, so you can keep chaining and end with a template literal:

```ts
export interface AnsiFactory {
  normal: AnsiTT;
  bold: AnsiTT;
  dim: AnsiTT;

  italic: AnsiTT;
  no_italic: AnsiTT;

  underline: AnsiTT;
  double_underline: AnsiTT;
  no_underline: AnsiTT;

  blink: AnsiTT;
  no_blink: AnsiTT;

  strike: AnsiTT;
  no_strike: AnsiTT;

  overline: AnsiTT;
  no_overline: AnsiTT;

  reverse: AnsiTT;
  no_reverse: AnsiTT;

  // Foreground colors
  color: (color: AnsiColor) => AnsiTT;
  default: AnsiTT;
  black: AnsiTT;
  red: AnsiTT;
  green: AnsiTT;
  yellow: AnsiTT;
  blue: AnsiTT;
  magenta: AnsiTT;
  cyan: AnsiTT;
  white: AnsiTT;
  intenseBlack: AnsiTT;
  intenseRed: AnsiTT;
  intenseGreen: AnsiTT;
  intenseYellow: AnsiTT;
  intenseBlue: AnsiTT;
  intenseMagenta: AnsiTT;
  intenseCyan: AnsiTT;
  intenseWhite: AnsiTT;
  grayscale: (n: number) => AnsiTT;
  basicRgb: (r: number, g: number, b: number) => AnsiTT;
  trueColor: (r: number, g: number, b: number) => AnsiTT;

  // Background colors
  backgroundColor: (color: AnsiColor) => AnsiTT;
  backgroundDefault: AnsiTT;
  backgroundBlack: AnsiTT;
  backgroundRed: AnsiTT;
  backgroundGreen: AnsiTT;
  backgroundYellow: AnsiTT;
  backgroundBlue: AnsiTT;
  backgroundMagenta: AnsiTT;
  backgroundCyan: AnsiTT;
  backgroundWhite: AnsiTT;
  backgroundIntenseBlack: AnsiTT;
  backgroundIntenseRed: AnsiTT;
  backgroundIntenseGreen: AnsiTT;
  backgroundIntenseYellow: AnsiTT;
  backgroundIntenseBlue: AnsiTT;
  backgroundIntenseMagenta: AnsiTT;
  backgroundIntenseCyan: AnsiTT;
  backgroundIntenseWhite: AnsiTT;
  backgroundGrayscale: (n: number) => AnsiTT;
  backgroundBasicRgb: (r: number, g: number, b: number) => AnsiTT;
  backgroundTrueColor: (r: number, g: number, b: number) => AnsiTT;

  // Underline colors
  underlineColor: (color: AnsiColor) => AnsiTT;
  underlineDefault: AnsiTT;
  underlineBlack: AnsiTT;
  underlineRed: AnsiTT;
  underlineGreen: AnsiTT;
  underlineYellow: AnsiTT;
  underlineBlue: AnsiTT;
  underlineMagenta: AnsiTT;
  underlineCyan: AnsiTT;
  underlineWhite: AnsiTT;
  underlineIntenseBlack: AnsiTT;
  underlineIntenseRed: AnsiTT;
  underlineIntenseGreen: AnsiTT;
  underlineIntenseYellow: AnsiTT;
  underlineIntenseBlue: AnsiTT;
  underlineIntenseMagenta: AnsiTT;
  underlineIntenseCyan: AnsiTT;
  underlineIntenseWhite: AnsiTT;
  underlineGrayscale: (n: number) => AnsiTT;
  underlineBasicRgb: (r: number, g: number, b: number) => AnsiTT;
  underlineTrueColor: (r: number, g: number, b: number) => AnsiTT;
}
```

Example:

```ts
console.log(
  ansi
    .bold
    .underline
    .color(ansi.TRUE_COLOR(255, 128, 0))
    .backgroundBlue`🔥 Warning`
    .toString()
);
```

### `NoopAnsi`

You can render an `Ansi` object **without** ANSI escape codes by using `NoopAnsi`. This is useful for environments that cannot display escape sequences (logs, files, CI text captures, etc.).

```ts
import { Ansi } from "ansi-escape-code";
import { NoopAnsi } from "ansi-escape-code/NoopAnsi";

function printWithoutAnsiEscape(someAnsiObject: Ansi) {
  console.log(new NoopAnsi({}, someAnsiObject).toString());
}
```

## Advanced: nesting & option resolution

* Every `Ansi` instance carries **partial** options and a list of parts (`AnsiPart[]`) that can themselves be `Ansi` instances or any `{ toString(): string }`.
* When calling `toString()`, the library determines the **difference** between the currently active style and the child’s requested style, emitting only the necessary escape codes (and resets) at boundaries.
* This is what enables **deep nesting** without style leakage or unnecessary resets.

## TypeScript types

Key exported types:

```ts
export type AnsiPart = Ansi | { toString(): string };

export interface AnsiOptions {
  weight: "normal" | "bold" | "dim";
  italic: boolean;
  underline: "none" | "single" | "double";
  blink: boolean;
  strike: boolean;
  overline: boolean;
  reverse: boolean;
  underlineColor: AnsiColor;
  foregroundColor: AnsiColor;
  backgroundColor: AnsiColor;
}

export type AnsiTemplateTag =
  (strings: TemplateStringsArray, ...values: readonly AnsiPart[]) => Ansi;

export interface AnsiFactory { /* see full list above */ }

type AnsiTT = AnsiFactory & AnsiTemplateTag;
```

## FAQ

**Q: Why do I need to call `.toString()`?**  
A: To make composition easy and avoid magic side effects. You can always delay final rendering until you actually need the string.

**Q: Can I mix plain strings with `Ansi` parts?**  
A: Yes — any object with a `toString()` method (including plain strings) can be interpolated.

**Q: How do I completely disable colors?**  
A: Use `ansi-escape-code/node` / `ansi-escape-code/proxy-node` to automatically strip when not a TTY, or manually wrap with `NoopAnsi` / provide a noop renderer.

**Q: How expensive is nesting?**  
A: The library computes minimal transitions between styles. Unless you’re generating **huge** volumes per frame, you’ll be fine.

## License

MIT
