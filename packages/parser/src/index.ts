import { AnsiColor, AnsiString } from "@ansi-escape-code/type";

/** Options controlling how ANSI strings are parsed. */
export interface ParseAnsiStringOptions {
  flags?: number;
  underlineColor?: AnsiColor;
  foregroundColor?: AnsiColor;
  backgroundColor?: AnsiColor;
}

/** Successful result returned from {@link parseAnsiString}. */
export interface ParseAnsiStringResultOk {
  success: true;
  ansiString: AnsiString[];
  remainFlags: number;
  remainUnderlineColor: AnsiColor;
  remainForegroundColor: AnsiColor;
  remainBackgroundColor: AnsiColor;
}

/** Error result returned from {@link parseAnsiString}. */
export interface ParseAnsiStringResultError {
  success: false;
  error: "unclosed-escape-sequence" | ParseAnsiStringFlagsResultError["error"];
}

export type ParseAnsiStringResult =
  | ParseAnsiStringResultOk
  | ParseAnsiStringResultError;

/**
 * Parses a string containing ANSI escape sequences.
 *
 * @example
 * const res = parseAnsiString("\x1b[31mred\x1b[39m");
 * res.ansiString.map(s => s.content).join("");
 * // => "red"
 */
export function parseAnsiString(
  input: string,
  {
    flags: initialFlags = 0,
    underlineColor: initialUnderlineColor = null,
    foregroundColor: initialForegroundColor = [5, 0],
    backgroundColor: initialBackgroundColor = [5, 0],
  }: ParseAnsiStringOptions = {}
): ParseAnsiStringResult {
  let result: AnsiString[] = [];
  let flags = initialFlags;
  let underlineColor = initialUnderlineColor;
  let foregroundColor = initialForegroundColor;
  let backgroundColor = initialBackgroundColor;
  let index = 0;
  while (index < input.length) {
    const nextOpen = input.indexOf("\x1b[", index);
    if (nextOpen === -1) {
      result.push(
        new AnsiString(
          input.slice(index),
          flags,
          underlineColor,
          foregroundColor,
          backgroundColor
        )
      );
      break;
    }

    result.push(
      new AnsiString(
        input.slice(index, nextOpen),
        flags,
        underlineColor,
        foregroundColor,
        backgroundColor
      )
    );
    const nextClose = input.indexOf("m", nextOpen);
    if (nextClose === -1) {
      return {
        success: false,
        error: "unclosed-escape-sequence",
      };
    }

    const arr = input.slice(nextOpen + 2, nextClose).split(";");
    const flagsResult = parseAnsiStringFlags(
      arr.length ? arr.map(Number) : [],
      {
        flags,
        underlineColor,
        foregroundColor,
        backgroundColor,
      }
    );

    if (!flagsResult.success) {
      return flagsResult;
    }

    ({ flags, underlineColor, foregroundColor, backgroundColor } = flagsResult);
  }

  return {
    success: true,
    ansiString: result,
    remainFlags: flags,
    remainUnderlineColor: underlineColor,
    remainForegroundColor: foregroundColor,
    remainBackgroundColor: backgroundColor,
  };
}

/** Successful result returned from {@link parseAnsiStringFlags}. */
export interface ParseAnsiStringFlagsResultOk {
  success: true;
  flags: number;
  underlineColor: AnsiColor;
  foregroundColor: AnsiColor;
  backgroundColor: AnsiColor;
}

/** Error result returned from {@link parseAnsiStringFlags}. */
export interface ParseAnsiStringFlagsResultError {
  success: false;
  error: "invalid-flags";
}

export type ParseAnsiStringFlagsResult =
  | ParseAnsiStringFlagsResultOk
  | ParseAnsiStringFlagsResultError;

/**
 * Parses an array of numeric SGR codes.
 *
 * @example
 * const res = parseAnsiStringFlags([1, 31]);
 * res.foregroundColor;
 * // => [5, 1]
 */
export function parseAnsiStringFlags(
  input: number[],
  {
    flags: initialFlags = 0,
    underlineColor: initialUnderlineColor = null,
    foregroundColor: initialForegroundColor = null,
    backgroundColor: initialBackgroundColor = null,
  }: ParseAnsiStringOptions = {}
): ParseAnsiStringFlagsResult {
  if (
    input.some((flag) => flag < 0 || flag > 255 || Math.floor(flag) !== flag)
  ) {
    return { success: false, error: "invalid-flags" };
  }

  if (!input.length) {
    return {
      success: true,
      flags:
        AnsiString.WEIGHT_NORMAL_BIT |
        AnsiString.NO_ITALIC_BIT |
        AnsiString.NO_UNDERLINE_BITS |
        AnsiString.NO_BLINK_BIT |
        AnsiString.NO_STRIKE_BIT |
        AnsiString.NO_OVERLINE_BIT |
        AnsiString.NO_REVERSE_BIT,
      underlineColor: null,
      foregroundColor: null,
      backgroundColor: null,
    };
  }

  let flags = initialFlags;
  let underlineColor = initialUnderlineColor;
  let foregroundColor = initialForegroundColor;
  let backgroundColor = initialBackgroundColor;

  let index = 0;

  while (index < input.length) {
    const flag = input[index];
    if (flag === 0) {
      flags =
        AnsiString.WEIGHT_NORMAL_BIT |
        AnsiString.NO_ITALIC_BIT |
        AnsiString.NO_UNDERLINE_BITS |
        AnsiString.NO_BLINK_BIT |
        AnsiString.NO_STRIKE_BIT |
        AnsiString.NO_OVERLINE_BIT |
        AnsiString.NO_REVERSE_BIT;
      underlineColor = null;
      foregroundColor = null;
      backgroundColor = null;
      index++;
      continue;
    } else if (flag === 1) {
      flags = (flags & ~AnsiString.WEIGHT_MASK) | AnsiString.WEIGHT_BOLD_BIT;
      index++;
    } else if (flag === 2) {
      flags = (flags & ~AnsiString.WEIGHT_MASK) | AnsiString.WEIGHT_DIM_BITS;
      index++;
    } else if (flag === 3) {
      flags = (flags & ~AnsiString.ITALIC_MASK) | AnsiString.ITALIC_BIT;
      index++;
    } else if (flag === 4) {
      flags = (flags & ~AnsiString.UNDERLINE_MASK) | AnsiString.UNDERLINE_BIT;
      index++;
    } else if (flag === 5 || flag === 6) {
      flags = (flags & ~AnsiString.BLINK_MASK) | AnsiString.BLINK_BIT;
      index++;
    } else if (flag === 7) {
      flags = (flags & ~AnsiString.REVERSE_MASK) | AnsiString.REVERSE_BIT;
      index++;
    } else if (flag === 9) {
      flags = (flags & ~AnsiString.STRIKE_MASK) | AnsiString.STRIKE_BIT;
      index++;
    } else if (flag === 21) {
      flags =
        (flags & ~AnsiString.UNDERLINE_MASK) | AnsiString.DOUBLE_UNDERLINE_BIT;
      index++;
    } else if (flag === 22) {
      flags = (flags & ~AnsiString.WEIGHT_MASK) | AnsiString.WEIGHT_NORMAL_BIT;
      index++;
    } else if (flag === 23) {
      flags = (flags & ~AnsiString.ITALIC_MASK) | AnsiString.NO_ITALIC_BIT;
      index++;
    } else if (flag === 24) {
      flags =
        (flags & ~AnsiString.UNDERLINE_MASK) | AnsiString.NO_UNDERLINE_BITS;
      index++;
    } else if (flag === 25) {
      flags = (flags & ~AnsiString.BLINK_MASK) | AnsiString.NO_BLINK_BIT;
      index++;
    } else if (flag === 27) {
      flags = (flags & ~AnsiString.REVERSE_MASK) | AnsiString.NO_REVERSE_BIT;
      index++;
    } else if (flag === 29) {
      flags = (flags & ~AnsiString.STRIKE_MASK) | AnsiString.NO_STRIKE_BIT;
      index++;
    } else if (30 <= flag && flag <= 37) {
      foregroundColor = [5, flag - 30];
      index++;
    } else if (flag === 38) {
      if (input[index + 1] === 5) {
        if (
          input.length < index + 2 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        foregroundColor = [5, input[index + 2]];
        index += 2;
      } else if (input[index + 1] === 2) {
        if (
          input.length < index + 4 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255 ||
          input[index + 3] < 0 ||
          input[index + 3] > 255 ||
          input[index + 4] < 0 ||
          input[index + 4] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        foregroundColor = [
          2,
          input[index + 2],
          input[index + 3],
          input[index + 4],
        ];
        index += 4;
      } else {
        return { success: false, error: "invalid-flags" };
      }
    } else if (flag === 39) {
      foregroundColor = null;
    } else if (40 <= flag && flag <= 47) {
      backgroundColor = [5, flag - 40];
      index++;
    } else if (flag === 48) {
      if (input[index + 1] === 5) {
        if (
          input.length < index + 2 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        backgroundColor = [5, input[index + 2]];
        index += 2;
      } else if (input[index + 1] === 2) {
        if (
          input.length < index + 4 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255 ||
          input[index + 3] < 0 ||
          input[index + 3] > 255 ||
          input[index + 4] < 0 ||
          input[index + 4] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        backgroundColor = [
          2,
          input[index + 2],
          input[index + 3],
          input[index + 4],
        ];
        index += 4;
      } else {
        return { success: false, error: "invalid-flags" };
      }
    } else if (flag === 49) {
      backgroundColor = null;
      index++;
    } else if (flag === 53) {
      flags = (flags & ~AnsiString.OVERLINE_MASK) | AnsiString.OVERLINE_BIT;
      index++;
    } else if (flag === 55) {
      flags = (flags & ~AnsiString.OVERLINE_MASK) | AnsiString.NO_OVERLINE_BIT;
      index++;
    } else if (flag === 58) {
      if (input[index + 1] === 5) {
        if (
          input.length < index + 2 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        underlineColor = [5, input[index + 2]];
        index += 2;
      } else if (input[index + 1] === 2) {
        if (
          input.length < index + 4 ||
          input[index + 2] < 0 ||
          input[index + 2] > 255 ||
          input[index + 3] < 0 ||
          input[index + 3] > 255 ||
          input[index + 4] < 0 ||
          input[index + 4] > 255
        ) {
          return { success: false, error: "invalid-flags" };
        }
        underlineColor = [
          2,
          input[index + 2],
          input[index + 3],
          input[index + 4],
        ];
        index += 4;
      } else {
        return { success: false, error: "invalid-flags" };
      }
    } else if (flag === 59) {
      underlineColor = null;
      index++;
    } else if (90 <= flag && flag <= 97) {
      foregroundColor = [5, flag - 82];
      index++;
    } else if (100 <= flag && flag <= 107) {
      backgroundColor = [5, flag - 92];
      index++;
    } else {
      flags = flags | AnsiString.UNKNOWN_BIT;
      index++;
    }
  }

  return {
    success: true,
    flags,
    underlineColor,
    foregroundColor,
    backgroundColor,
  };
}
