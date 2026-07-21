const assert = require("node:assert/strict");
const test = require("node:test");
const { parseAnsiString } = require("../packages/parser/dist");

test("legacy parser terminates and preserves remaining state", () => {
  const result = parseAnsiString("\x1b[31mred\x1b[0m plain");
  assert.equal(result.success, true);
  assert.equal(result.ansiString.map((item) => item.content).join(""), "red plain");
});
