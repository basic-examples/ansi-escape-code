import type { AnsiColor } from "@ansi-escape-code/type";

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

export type AnsiTemplateTag = (
  strings: TemplateStringsArray,
  ...values: readonly AnsiPart[]
) => Ansi;

export class Ansi {
  public static readonly defaultOptions: AnsiOptions = {
    weight: "normal",
    italic: false,
    underline: "none",
    blink: false,
    strike: false,
    overline: false,
    reverse: false,
    underlineColor: null,
    foregroundColor: null,
    backgroundColor: null,
  };

  public readonly parts: AnsiPart[];

  constructor(
    public readonly options: Partial<AnsiOptions>,
    ...parts: AnsiPart[]
  ) {
    this.parts = parts;
  }

  public toString(
    resolvedOuterOptions: AnsiOptions = Ansi.defaultOptions
  ): string {
    return this.toStringInternal(resolvedOuterOptions);
  }

  private toStringInternal(resolvedOuterOptions: AnsiOptions): string {
    const resolvedInnerOptions = {
      ...resolvedOuterOptions,
      ...(this.options.weight !== undefined && { weight: this.options.weight }),
      ...(this.options.italic !== undefined && { italic: this.options.italic }),
      ...(this.options.underline !== undefined && {
        underline: this.options.underline,
      }),
      ...(this.options.blink !== undefined && { blink: this.options.blink }),
      ...(this.options.strike !== undefined && { strike: this.options.strike }),
      ...(this.options.foregroundColor !== undefined && {
        foregroundColor: this.options.foregroundColor,
      }),
      ...(this.options.backgroundColor !== undefined && {
        backgroundColor: this.options.foregroundColor,
      }),
    };
    const [change, restore] = Ansi.changes(
      resolvedOuterOptions,
      resolvedInnerOptions
    );
    const parts = this.parts
      .map((part) => {
        if (part instanceof Ansi) {
          return part.toStringInternal(resolvedInnerOptions);
        }

        return part.toString();
      })
      .join("");
    return `${change}${parts}${restore}`;
  }

  private static changes(
    resolvedOuterOptions: AnsiOptions,
    resolvedInnerOptions: AnsiOptions
  ): [change: string, restore: string] {
    const weightChanged =
      resolvedInnerOptions.weight !== resolvedOuterOptions.weight;
    const italicChanged =
      resolvedInnerOptions.italic !== resolvedOuterOptions.italic;
    const underlineChanged =
      resolvedInnerOptions.underline !== resolvedOuterOptions.underline;
    const blinkChanged =
      resolvedInnerOptions.blink !== resolvedOuterOptions.blink;
    const strikeChanged =
      resolvedInnerOptions.strike !== resolvedOuterOptions.strike;
    const overlineChanged =
      resolvedInnerOptions.overline !== resolvedOuterOptions.overline;
    const reverseChanged =
      resolvedInnerOptions.reverse !== resolvedOuterOptions.reverse;
    const underlineColorChanged = !Ansi.isSameColor(
      resolvedInnerOptions.underlineColor,
      resolvedOuterOptions.underlineColor
    );
    const foregroundColorChanged = !Ansi.isSameColor(
      resolvedInnerOptions.foregroundColor,
      resolvedOuterOptions.foregroundColor
    );
    const backgroundColorChanged = !Ansi.isSameColor(
      resolvedInnerOptions.backgroundColor,
      resolvedOuterOptions.backgroundColor
    );
    const changed =
      weightChanged ||
      italicChanged ||
      underlineChanged ||
      blinkChanged ||
      strikeChanged ||
      foregroundColorChanged ||
      backgroundColorChanged;
    if (!changed) {
      return ["", ""];
    }

    return [
      `\x1b[${[
        weightChanged &&
          (resolvedInnerOptions.weight === "normal"
            ? 22
            : resolvedInnerOptions.weight === "bold"
            ? 1
            : 2),
        italicChanged && (resolvedInnerOptions.italic ? 3 : 23),
        underlineChanged &&
          (resolvedInnerOptions.underline === "single"
            ? 4
            : resolvedInnerOptions.underline === "double"
            ? 21
            : 24),
        blinkChanged && (resolvedInnerOptions.blink ? 5 : 25),
        strikeChanged && (resolvedInnerOptions.strike ? 9 : 29),
        overlineChanged && (resolvedInnerOptions.overline ? 53 : 55),
        reverseChanged && (resolvedInnerOptions.reverse ? 7 : 27),
        ...(underlineColorChanged
          ? resolvedInnerOptions.underlineColor === null
            ? [59]
            : [58, ...resolvedInnerOptions.underlineColor]
          : []),
        ...(foregroundColorChanged
          ? resolvedInnerOptions.foregroundColor === null
            ? [39]
            : [38, ...resolvedInnerOptions.foregroundColor]
          : []),
        ...(backgroundColorChanged
          ? resolvedInnerOptions.backgroundColor === null
            ? [49]
            : [48, ...resolvedInnerOptions.backgroundColor]
          : []),
      ]
        .filter((a) => a)
        .join(";")}m`,
      `\x1b[${[
        weightChanged &&
          (resolvedOuterOptions.weight === "normal"
            ? 22
            : resolvedOuterOptions.weight === "bold"
            ? 1
            : 2),
        italicChanged && (resolvedOuterOptions.italic ? 3 : 23),
        underlineChanged &&
          (resolvedOuterOptions.underline === "single"
            ? 4
            : resolvedOuterOptions.underline === "double"
            ? 21
            : 24),
        blinkChanged && (resolvedOuterOptions.blink ? 5 : 25),
        strikeChanged && (resolvedOuterOptions.strike ? 9 : 29),
        ...(foregroundColorChanged
          ? resolvedOuterOptions.foregroundColor === null
            ? [39]
            : [38, ...resolvedOuterOptions.foregroundColor]
          : []),
        ...(backgroundColorChanged
          ? resolvedOuterOptions.backgroundColor === null
            ? [49]
            : [48, ...resolvedOuterOptions.backgroundColor]
          : []),
      ]
        .filter((a) => a)
        .join(";")}m`,
    ];
  }

  private static isSameColor(a: AnsiColor, b: AnsiColor): boolean {
    if (a === null || b === null) {
      return a === b;
    }

    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }

  public static readonly STANDARD_BLACK: AnsiColor = [5, 0];
  public static readonly STANDARD_RED: AnsiColor = [5, 1];
  public static readonly STANDARD_GREEN: AnsiColor = [5, 2];
  public static readonly STANDARD_YELLOW: AnsiColor = [5, 3];
  public static readonly STANDARD_BLUE: AnsiColor = [5, 4];
  public static readonly STANDARD_MAGENTA: AnsiColor = [5, 5];
  public static readonly STANDARD_CYAN: AnsiColor = [5, 6];
  public static readonly STANDARD_WHITE: AnsiColor = [5, 7];
  public static readonly INTENSE_BLACK: AnsiColor = [5, 8];
  public static readonly INTENSE_RED: AnsiColor = [5, 9];
  public static readonly INTENSE_GREEN: AnsiColor = [5, 10];
  public static readonly INTENSE_YELLOW: AnsiColor = [5, 11];
  public static readonly INTENSE_BLUE: AnsiColor = [5, 12];
  public static readonly INTENSE_MAGENTA: AnsiColor = [5, 13];
  public static readonly INTENSE_CYAN: AnsiColor = [5, 14];
  public static readonly INTENSE_WHITE: AnsiColor = [5, 15];

  /**
   * @param n - Grayscale level (0-23)
   * @returns Ansi color code
   */
  public static GRAYSCALE(n: number): AnsiColor {
    return [5, 232 + n];
  }

  /**
   * @param r - Red component (0-5)
   * @param g - Green component (0-5)
   * @param b - Blue component (0-5)
   * @returns Ansi color code
   */
  public static BASIC_RGB(r: number, g: number, b: number): AnsiColor {
    return [5, 16 + r * 36 + g * 6 + b];
  }

  public static TRUE_COLOR(r: number, g: number, b: number): AnsiColor {
    return [2, r, g, b];
  }

  public static tt(first: Partial<AnsiOptions>): AnsiTemplateTag {
    const options = (first ?? {}) as Partial<AnsiOptions>;
    return (strings: TemplateStringsArray, ...values: AnsiPart[]) => {
      const parts = interleave(strings, values);
      return new this(options, ...parts);
    };
  }
}

function interleave(
  strings: TemplateStringsArray,
  values: readonly AnsiPart[]
): AnsiPart[] {
  const out: AnsiPart[] = [];
  for (let i = 0; i < strings.length; i++) {
    if (strings[i] !== "") out.push(strings[i]);
    if (i < values.length) out.push(values[i]);
  }
  return out;
}
