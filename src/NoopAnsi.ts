import { AnsiOptions, AnsiPart, Ansi as DefaultAnsi } from ".";
/**
 * Variant of {@link DefaultAnsi} that ignores all styling and simply
 * concatenates the contained parts.
 *
 * @example
 * const a = new NoopAnsi({}, "A", new DefaultAnsi({ foregroundColor: DefaultAnsi.STANDARD_RED }, "B"));
 * a.toString();
 * // => "AB"
 */

export class NoopAnsi extends DefaultAnsi {
  /**
   * @param _unusedOptions - Ignored styling options.
   * @param parts - Content parts to combine.
   */
  constructor(_unusedOptions: Partial<AnsiOptions>, ...parts: AnsiPart[]) {
    super({}, ...parts);
  }
  /**
   * Renders contained parts without escape sequences.
   */

  public toString(_unusedResolvedOuterOptions?: AnsiOptions): string {
    return NoopAnsi.toStringInternal(this.parts);
  }

  private static toStringInternal(parts: AnsiPart[]): string {
    return parts
      .map((part) => {
        if (part instanceof DefaultAnsi) {
          return NoopAnsi.toStringInternal(part.parts);
        }
        return part.toString();
      })
      .join("");
  }
}
