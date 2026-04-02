import esbuild from "esbuild";
import glob from "fast-glob";
import { execSync } from "node:child_process";

const entryPoints = await glob("src/**/*.ts", {
  ignore: ["src/**/*.d.ts", "src/**/*.test.ts", "src/**/*.spec.ts"],
});

if (entryPoints.length === 0) {
  console.error("❌ No source files found. Did you run 'pnpm generate' first?");
  process.exit(1);
}

// Build JS (ESM)
await esbuild.build({
  entryPoints,
  outdir: "dist/esm",
  format: "esm",
  platform: "node",
  target: "esnext",
  outbase: "src",
  bundle: false,
  sourcemap: true,
});

// Build types
execSync("tsc", { stdio: "inherit" });

console.log("✅ Build successfully!");
