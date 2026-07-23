import { Ansi } from "./node";
import { internal } from "./proxy";

/**
 * TTY-aware Proxy styling DSL for Node.js.
 *
 * It follows the same TTY and custom-inspection behavior as the Node.js
 * {@link Ansi} constructor.
 */
export const ansi = internal(Ansi, {});
