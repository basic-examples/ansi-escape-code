import { Ansi as DefaultAnsi } from ".";
import { NoopAnsi } from "./NoopAnsi";

export const Ansi =
  process.stdout.isTTY && process.stderr.isTTY ? DefaultAnsi : NoopAnsi;
