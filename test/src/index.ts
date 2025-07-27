import { ansi } from "ansi-escape-code/proxy-node";

console.log(ansi.red`Hello ${ansi.green.bold`Beautiful`} World`.toString());
