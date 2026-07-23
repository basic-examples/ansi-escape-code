import { inspect } from "node:util";
import { Ansi as DefaultAnsi } from ".";
import { NoopAnsi } from "./NoopAnsi";

class InspectableAnsi extends DefaultAnsi {
  public [inspect.custom](): string {
    return this.toString();
  }
}

class InspectableNoopAnsi extends NoopAnsi {
  public [inspect.custom](): string {
    return this.toString();
  }
}

/**
 * TTY-aware {@link DefaultAnsi} constructor for Node.js.
 *
 * Uses the styled implementation only when both `process.stdout` and
 * `process.stderr` are TTYs; otherwise it uses {@link NoopAnsi}. Instances also
 * support Node.js custom inspection and therefore render as text in utilities
 * such as `console.log`.
 *
 * Use the regular entry point with {@link NoopAnsi} directly when an
 * application needs a different output policy.
 */
export const Ansi: typeof DefaultAnsi =
  process.stdout.isTTY && process.stderr.isTTY
    ? InspectableAnsi
    : InspectableNoopAnsi;
