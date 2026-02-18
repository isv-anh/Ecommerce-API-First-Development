import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json"],
      include: ["src/**"],
      exclude: [
        "**/types/**",
        "src/app/layout.tsx",
        "src/generated/**",
        "src/mock/**",
      ],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      "**/types/**",
      "src/app/layout.tsx",
      "src/generated/**",
      "src/mock/**",
    ],
  },
});
