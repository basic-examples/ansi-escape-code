import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: [
    "src/index.ts",
    "src/node.ts",
    "src/NoopAnsi.ts",
    "src/proxy-node.ts",
    "src/proxy.ts",
  ],
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [terser(), typescript()],
};
