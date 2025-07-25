import { Ansi } from "ansi-escape-code/node";

console.log(
  new Ansi(
    { foregroundColor: Ansi.STANDARD_RED },
    "Hello ",
    new Ansi(
      {
        foregroundColor: Ansi.STANDARD_GREEN,
        weight: "bold",
      },
      "Beautiful"
    ),
    " World"
  ).toString()
);
