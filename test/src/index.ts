import { Ansi } from "ansi-escape-code";

console.log(
  new Ansi(
    { foregroundColor: [5, 1] },
    "Hello ",
    new Ansi({ foregroundColor: [5, 2], weight: "bold" }, "Beautiful"),
    " World"
  ).toString()
);
