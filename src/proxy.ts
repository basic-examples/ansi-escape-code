import type { AnsiColor } from "@ansi-escape-code/type";
import { Ansi, AnsiOptions, AnsiPart, AnsiTemplateTag } from ".";

export interface AnsiFactory {
  normal: AnsiTT;
  bold: AnsiTT;
  dim: AnsiTT;
  italic: AnsiTT;
  no_italic: AnsiTT;
  underline: AnsiTT;
  double_underline: AnsiTT;
  no_underline: AnsiTT;
  blink: AnsiTT;
  no_blink: AnsiTT;
  strike: AnsiTT;
  no_strike: AnsiTT;
  overline: AnsiTT;
  no_overline: AnsiTT;
  reverse: AnsiTT;
  no_reverse: AnsiTT;
  color: (color: AnsiColor) => AnsiTT;
  default: AnsiTT;
  black: AnsiTT;
  red: AnsiTT;
  green: AnsiTT;
  yellow: AnsiTT;
  blue: AnsiTT;
  magenta: AnsiTT;
  cyan: AnsiTT;
  white: AnsiTT;
  intenseBlack: AnsiTT;
  intenseRed: AnsiTT;
  intenseGreen: AnsiTT;
  intenseYellow: AnsiTT;
  intenseBlue: AnsiTT;
  intenseMagenta: AnsiTT;
  intenseCyan: AnsiTT;
  intenseWhite: AnsiTT;
  grayscale: (n: number) => AnsiTT;
  basicRgb: (r: number, g: number, b: number) => AnsiTT;
  trueColor: (r: number, g: number, b: number) => AnsiTT;
  backgroundColor: (color: AnsiColor) => AnsiTT;
  backgroundDefault: AnsiTT;
  backgroundBlack: AnsiTT;
  backgroundRed: AnsiTT;
  backgroundGreen: AnsiTT;
  backgroundYellow: AnsiTT;
  backgroundBlue: AnsiTT;
  backgroundMagenta: AnsiTT;
  backgroundCyan: AnsiTT;
  backgroundWhite: AnsiTT;
  backgroundIntenseBlack: AnsiTT;
  backgroundIntenseRed: AnsiTT;
  backgroundIntenseGreen: AnsiTT;
  backgroundIntenseYellow: AnsiTT;
  backgroundIntenseBlue: AnsiTT;
  backgroundIntenseMagenta: AnsiTT;
  backgroundIntenseCyan: AnsiTT;
  backgroundIntenseWhite: AnsiTT;
  backgroundGrayscale: (n: number) => AnsiTT;
  backgroundBasicRgb: (r: number, g: number, b: number) => AnsiTT;
  backgroundTrueColor: (r: number, g: number, b: number) => AnsiTT;
  underlineColor: (color: AnsiColor) => AnsiTT;
  underlineDefault: AnsiTT;
  underlineBlack: AnsiTT;
  underlineRed: AnsiTT;
  underlineGreen: AnsiTT;
  underlineYellow: AnsiTT;
  underlineBlue: AnsiTT;
  underlineMagenta: AnsiTT;
  underlineCyan: AnsiTT;
  underlineWhite: AnsiTT;
  underlineIntenseBlack: AnsiTT;
  underlineIntenseRed: AnsiTT;
  underlineIntenseGreen: AnsiTT;
  underlineIntenseYellow: AnsiTT;
  underlineIntenseBlue: AnsiTT;
  underlineIntenseMagenta: AnsiTT;
  underlineIntenseCyan: AnsiTT;
  underlineIntenseWhite: AnsiTT;
  underlineGrayscale: (n: number) => AnsiTT;
  underlineBasicRgb: (r: number, g: number, b: number) => AnsiTT;
  underlineTrueColor: (r: number, g: number, b: number) => AnsiTT;
}

type AnsiTT = AnsiFactory & AnsiTemplateTag;

const optionsMap: Record<
  keyof AnsiFactory,
  Partial<AnsiOptions> | ((...args: unknown[]) => Partial<AnsiOptions>)
> = {
  normal: { weight: "normal" },
  bold: { weight: "bold" },
  dim: { weight: "dim" },
  italic: { italic: true },
  no_italic: { italic: false },
  underline: { underline: "single" },
  double_underline: { underline: "double" },
  no_underline: { underline: "none" },
  blink: { blink: true },
  no_blink: { blink: false },
  strike: { strike: true },
  no_strike: { strike: false },
  overline: { overline: true },
  no_overline: { overline: false },
  reverse: { reverse: true },
  no_reverse: { reverse: false },
  color: ((color: AnsiColor): Partial<AnsiOptions> => ({
    foregroundColor: color,
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  default: { foregroundColor: null },
  black: { foregroundColor: Ansi.STANDARD_BLACK },
  red: { foregroundColor: Ansi.STANDARD_RED },
  green: { foregroundColor: Ansi.STANDARD_GREEN },
  yellow: { foregroundColor: Ansi.STANDARD_YELLOW },
  blue: { foregroundColor: Ansi.STANDARD_BLUE },
  magenta: { foregroundColor: Ansi.STANDARD_MAGENTA },
  cyan: { foregroundColor: Ansi.STANDARD_CYAN },
  white: { foregroundColor: Ansi.STANDARD_WHITE },
  intenseBlack: { foregroundColor: Ansi.INTENSE_BLACK },
  intenseRed: { foregroundColor: Ansi.INTENSE_RED },
  intenseGreen: { foregroundColor: Ansi.INTENSE_GREEN },
  intenseYellow: { foregroundColor: Ansi.INTENSE_YELLOW },
  intenseBlue: { foregroundColor: Ansi.INTENSE_BLUE },
  intenseMagenta: { foregroundColor: Ansi.INTENSE_MAGENTA },
  intenseCyan: { foregroundColor: Ansi.INTENSE_CYAN },
  intenseWhite: { foregroundColor: Ansi.INTENSE_WHITE },
  grayscale: ((n: number): Partial<AnsiOptions> => ({
    foregroundColor: Ansi.GRAYSCALE(n),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  basicRgb: ((r: number, g: number, b: number): Partial<AnsiOptions> => ({
    foregroundColor: Ansi.BASIC_RGB(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  trueColor: ((r: number, g: number, b: number): Partial<AnsiOptions> => ({
    foregroundColor: Ansi.TRUE_COLOR(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  backgroundColor: ((color: AnsiColor): Partial<AnsiOptions> => ({
    backgroundColor: color,
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  backgroundDefault: { backgroundColor: null },
  backgroundBlack: { backgroundColor: Ansi.STANDARD_BLACK },
  backgroundRed: { backgroundColor: Ansi.STANDARD_RED },
  backgroundGreen: { backgroundColor: Ansi.STANDARD_GREEN },
  backgroundYellow: { backgroundColor: Ansi.STANDARD_YELLOW },
  backgroundBlue: { backgroundColor: Ansi.STANDARD_BLUE },
  backgroundMagenta: { backgroundColor: Ansi.STANDARD_MAGENTA },
  backgroundCyan: { backgroundColor: Ansi.STANDARD_CYAN },
  backgroundWhite: { backgroundColor: Ansi.STANDARD_WHITE },
  backgroundIntenseBlack: { backgroundColor: Ansi.INTENSE_BLACK },
  backgroundIntenseRed: { backgroundColor: Ansi.INTENSE_RED },
  backgroundIntenseGreen: { backgroundColor: Ansi.INTENSE_GREEN },
  backgroundIntenseYellow: { backgroundColor: Ansi.INTENSE_YELLOW },
  backgroundIntenseBlue: { backgroundColor: Ansi.INTENSE_BLUE },
  backgroundIntenseMagenta: { backgroundColor: Ansi.INTENSE_MAGENTA },
  backgroundIntenseCyan: { backgroundColor: Ansi.INTENSE_CYAN },
  backgroundIntenseWhite: { backgroundColor: Ansi.INTENSE_WHITE },
  backgroundGrayscale: ((n: number): Partial<AnsiOptions> => ({
    backgroundColor: Ansi.GRAYSCALE(n),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  backgroundBasicRgb: ((
    r: number,
    g: number,
    b: number
  ): Partial<AnsiOptions> => ({
    backgroundColor: Ansi.BASIC_RGB(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  backgroundTrueColor: ((
    r: number,
    g: number,
    b: number
  ): Partial<AnsiOptions> => ({
    backgroundColor: Ansi.TRUE_COLOR(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  underlineColor: ((color: AnsiColor): Partial<AnsiOptions> => ({
    underlineColor: color,
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  underlineDefault: { underlineColor: null },
  underlineBlack: { underlineColor: Ansi.STANDARD_BLACK },
  underlineRed: { underlineColor: Ansi.STANDARD_RED },
  underlineGreen: { underlineColor: Ansi.STANDARD_GREEN },
  underlineYellow: { underlineColor: Ansi.STANDARD_YELLOW },
  underlineBlue: { underlineColor: Ansi.STANDARD_BLUE },
  underlineMagenta: { underlineColor: Ansi.STANDARD_MAGENTA },
  underlineCyan: { underlineColor: Ansi.STANDARD_CYAN },
  underlineWhite: { underlineColor: Ansi.STANDARD_WHITE },
  underlineIntenseBlack: { underlineColor: Ansi.INTENSE_BLACK },
  underlineIntenseRed: { underlineColor: Ansi.INTENSE_RED },
  underlineIntenseGreen: { underlineColor: Ansi.INTENSE_GREEN },
  underlineIntenseYellow: { underlineColor: Ansi.INTENSE_YELLOW },
  underlineIntenseBlue: { underlineColor: Ansi.INTENSE_BLUE },
  underlineIntenseMagenta: { underlineColor: Ansi.INTENSE_MAGENTA },
  underlineIntenseCyan: { underlineColor: Ansi.INTENSE_CYAN },
  underlineIntenseWhite: { underlineColor: Ansi.INTENSE_WHITE },
  underlineGrayscale: ((n: number): Partial<AnsiOptions> => ({
    underlineColor: Ansi.GRAYSCALE(n),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  underlineBasicRgb: ((
    r: number,
    g: number,
    b: number
  ): Partial<AnsiOptions> => ({
    underlineColor: Ansi.BASIC_RGB(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
  underlineTrueColor: ((
    r: number,
    g: number,
    b: number
  ): Partial<AnsiOptions> => ({
    underlineColor: Ansi.TRUE_COLOR(r, g, b),
  })) as (...args: unknown[]) => Partial<AnsiOptions>,
};

function noop() {}

export function internal(
  ansi: new (options: Partial<AnsiOptions>, ...parts: AnsiPart[]) => Ansi,
  options: Partial<AnsiOptions>
): AnsiTT {
  return new Proxy(noop as unknown as AnsiTT, {
    apply: (_target, _thisArg, args: Parameters<AnsiTemplateTag>) => {
      return Ansi.tt.apply(ansi, [options])(...args);
    },
    get: (_target, prop: keyof AnsiFactory) => {
      const option = optionsMap[prop];
      if (option === undefined) {
        return undefined;
      } else if (typeof option === "function") {
        return (...args: unknown[]) =>
          internal(ansi, { ...options, ...option(...args) });
      } else {
        return internal(ansi, { ...options, ...option });
      }
    },
  }) as AnsiTT;
}

export const ansi = internal(Ansi, {});
