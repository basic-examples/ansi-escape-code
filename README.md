# `ansi-escape-code`

Effortless ANSI styling with nesting support

```js
import { Ansi } from "ansi-escape-code";

console.log(
  Ansi.tt({ foregroundColor: Ansi.STANDARD_RED })`Hello ${Ansi.tt({
    foregroundColor: Ansi.STANDARD_GREEN,
    weight: "bold",
  })`Beautiful`} World`.toString()
);
```

## NoopAnsi

You can print an `Ansi` object without ANSI escape codes by using `NoopAnsi`.

```ts
import { Ansi } from "ansi-escape-code";
import { NoopAnsi } from "ansi-escape-code/NoopAnsi";

function printWithoutAnsiEscape(someAnsiObject: Ansi) {
  console.log(new NoopAnsi(someAnsiObject).toString());
}
```

## isTTY and Node.js

In most cases, you should avoid printing ANSI escape codes when the target stream is not a TTY.

If this applies to your case, import from `ansi-escape-code/node`; it will handle this automatically.
