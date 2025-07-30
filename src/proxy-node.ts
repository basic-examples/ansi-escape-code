import { NoopAnsi } from "./NoopAnsi";
import { ansi as defaultAnsi, internal } from "./proxy";

/**
 * TTY-aware proxy based factory. Falls back to {@link NoopAnsi} when not in TTY.
 *
 * @example
 * ansi.red`hi`.toString();
 * // => "\x1b[31mhi\x1b[39m"
 */
export const ansi =
  process.stdout.isTTY && process.stderr.isTTY
    ? defaultAnsi
    : internal(NoopAnsi, {});
