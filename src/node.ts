import { Ansi as DefaultAnsi } from ".";
import { NoopAnsi } from "./NoopAnsi";

/**
 * TTY-aware Ansi class that falls back to {@link NoopAnsi} when not in TTY.
 *
 * @example
 * typeof Ansi;
 * // => "function"
 */
export const Ansi =
  process.stdout.isTTY && process.stderr.isTTY ? DefaultAnsi : NoopAnsi;
