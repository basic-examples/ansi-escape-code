import { ansi } from "../dist/proxy";

type IsEqual<A, B> = (<T>() => T extends A ? 0 : 1) extends <T>() =>
  T extends B ? 0 : 1
  ? true
  : false;
type Assert<True extends true> = True;

type _ChainedStyleRemainsCallable = Assert<
  IsEqual<typeof ansi.red, typeof ansi>
>;

const tagged = ansi.red`ansi`;
const called = ansi.trueColor(255, 80, 40)("ansi");

const _taggedMustCoerceToString: string = "Hello " + tagged + " text!";
const _calledMustCoerceToString: string = `Hello ${called} text!`;
