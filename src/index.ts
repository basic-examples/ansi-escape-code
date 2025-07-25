import { AnsiColor } from "@ansi-escape-code/type";

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
}
