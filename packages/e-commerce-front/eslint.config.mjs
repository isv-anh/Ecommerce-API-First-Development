import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: false,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "./src/generated/**",
  ]),
]);

export default eslintConfig;
