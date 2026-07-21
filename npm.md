# `ansi-escape-code`

Effortless, fully nestable ANSI styling — with both a tiny class-based core **and** a super-ergonomic `Proxy` interface.

```js
import { ansi } from "ansi-escape-code/proxy";

console.log(ansi.red`Hello ${ansi.green.bold`Beautiful`} World`.toString());
console.log(ansi.trueColor(255, 80, 40).bold("Hot!").toString());
```

[API Docs](https://basic-examples.github.io/ansi-escape-code) — hosted separately to reduce npm package size.

For a full ANSI/VT reference, decoder, builder, and terminal support matrix,
see [Ansicode](https://ansicode.eversources.app/en).
