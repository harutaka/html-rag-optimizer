import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs", "esm"],
  dts: { sourcemap: true },
  clean: true,
  minify: false,
  target: "node18",
});
