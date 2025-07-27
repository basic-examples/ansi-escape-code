import { Ansi } from "ansi-escape-code/node";

console.log(
  Ansi.tt({ foregroundColor: Ansi.STANDARD_RED })`Hello ${Ansi.tt({
    foregroundColor: Ansi.STANDARD_GREEN,
    weight: "bold",
  })`Beautiful`} World`.toString()
);
