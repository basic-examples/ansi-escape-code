const assert = require("node:assert/strict");
const test = require("node:test");
const { inspect } = require("node:util");
const { Ansi } = require("../dist");
const { ansi } = require("../dist/proxy");
const { ansi: nodeAnsi } = require("../dist/proxy-node");

test("renders and restores nested styles", () => {
  assert.equal(
    ansi.red`a${ansi.green.bold`b`}c`.toString(),
    "\x1b[31ma\x1b[1;32mb\x1b[22;31mc\x1b[39m"
  );
});

test("supports single-value calls with the same chainable DSL", () => {
  const text = "Error";
  assert.equal(
    ansi.trueColor(255, 80, 40).bold(text).toString(),
    "\x1b[1;38;2;255;80;40mError\x1b[22;39m"
  );
  assert.equal(
    ansi.red(ansi.green("nested")).toString(),
    "\x1b[31m\x1b[32mnested\x1b[31m\x1b[39m"
  );
  assert.throws(() => ansi.red(), /exactly one part/);
  assert.throws(() => ansi.red("a", "b"), /exactly one part/);
});

test("supports primitive string conversion", () => {
  const value = ansi.red("Error");
  assert.equal(String(value), value.toString());
  assert.equal(`${value}`, value.toString());
});

test("renders Node values through util.inspect.custom", () => {
  const value = nodeAnsi.red.bold("Error");
  assert.equal(inspect(value), value.toString());
});

test("renders background, underline color, reverse, overline, and hidden", () => {
  const value = new Ansi({
    backgroundColor: Ansi.STANDARD_BLUE,
    underlineColor: Ansi.TRUE_COLOR(1, 2, 3),
    reverse: true,
    overline: true,
    hidden: true,
  }, "x").toString();
  assert.equal(value, "\x1b[8;53;7;44;58;2;1;2;3mx\x1b[28;55;27;49;59m");
});

test("validates color helper ranges through output compatibility", () => {
  assert.deepEqual(Ansi.GRAYSCALE(0), [5, 232]);
  assert.deepEqual(Ansi.BASIC_RGB(5, 5, 5), [5, 231]);
  assert.throws(() => Ansi.GRAYSCALE(24), RangeError);
  assert.throws(() => Ansi.TRUE_COLOR(-1, 0, 0), RangeError);
});
