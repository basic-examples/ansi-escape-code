import { AnsiOptions, AnsiPart, Ansi as DefaultAnsi } from ".";

export class NoopAnsi extends DefaultAnsi {
  constructor(_unusedOptions: Partial<AnsiOptions>, ...parts: AnsiPart[]) {
    super({}, ...parts);
  }

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
