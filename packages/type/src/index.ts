export type AnsiColor =
  | null // default
  | [basic8: 5, index: number] // 256 colors
  | [rgb: 2, r: number, g: number, b: number];

export class AnsiString {
  static readonly WEIGHT_MASK = 3;
  static readonly WEIGHT_FOLLOW_BITS = 0;
  static readonly WEIGHT_NORMAL_BIT = 1;
  static readonly WEIGHT_BOLD_BIT = 2;
  static readonly WEIGHT_DIM_BITS = 3;

  static readonly ITALIC_MASK = 12; // 3 << 2
  static readonly ITALIC_FOLLOW_BITS = 0;
  static readonly ITALIC_BIT = 4; // 1 << 2
  static readonly NO_ITALIC_BIT = 8; // 2 << 2

  static readonly UNDERLINE_MASK = 48; // 3 << 4
  static readonly UNDERLINE_FOLLOW_BITS = 0;
  static readonly UNDERLINE_BIT = 16; // 1 < 4
  static readonly DOUBLE_UNDERLINE_BIT = 32; // 2 << 4
  static readonly NO_UNDERLINE_BITS = 48; // 3 << 4

  static readonly BLINK_MASK = 192; // 3 << 6
  static readonly BLINK_FOLLOW_BITS = 0;
  static readonly BLINK_BIT = 64; // 1 << 6
  static readonly NO_BLINK_BIT = 128; // 2 << 6

  static readonly STRIKE_MASK = 768; // 3 << 8
  static readonly STRIKE_FOLLOW_BITS = 0;
  static readonly STRIKE_BIT = 256; // 1 << 8
  static readonly NO_STRIKE_BIT = 512; // 2 << 8

  static readonly OVERLINE_MASK = 3072; // 3 << 10
  static readonly OVERLINE_FOLLOW_BITS = 0;
  static readonly OVERLINE_BIT = 1024; // 1 << 10
  static readonly NO_OVERLINE_BIT = 2048; // 2 << 10

  static readonly REVERSE_MASK = 6144; // 3 << 12
  static readonly REVERSE_FOLLOW_BITS = 0;
  static readonly REVERSE_BIT = 2048; // 1 << 12
  static readonly NO_REVERSE_BIT = 4096; // 2 << 2

  static readonly UNKNOWN_BIT = 16384; // 1 << 14

  constructor(
    public readonly content: string,
    public readonly attributeFlags: number,
    public readonly underlineColor: AnsiColor,
    public readonly foregroundColor: AnsiColor,
    public readonly backgroundColor: AnsiColor
  ) {}
}
