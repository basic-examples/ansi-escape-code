import { NoopAnsi } from "./NoopAnsi";
import { ansi as defaultAnsi, internal } from "./proxy";

export const ansi =
  process.stdout.isTTY && process.stderr.isTTY
    ? defaultAnsi
    : internal(NoopAnsi, {});
