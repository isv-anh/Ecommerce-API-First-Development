/// <reference types="node" />
import { ConfigExternal, defineConfig } from "orval";
import fs from "fs";
import path from "path";

const inputDir = "../../docs/openapi";

const apis: ConfigExternal = {};

fs.readdirSync(inputDir).forEach((file) => {
  if (
    file.endsWith(".yaml") ||
    file.endsWith(".yml") ||
    file.endsWith(".json")
  ) {
    const name = path.basename(file, path.extname(file));
    apis[name] = {
      input: {
        target: path.join(inputDir, file),
      },
      output: {
        mode: "split",
        target: `./src/generated/endpoints/${name}.ts`,
        schemas: `./src/generated/schemas/${name}`,
        client: "react-query",
        httpClient: "axios",
        mock: {
          type: "msw",
          locale: "vi",
          useExamples: true,
        },
        override: {
          query: {
            useSuspenseQuery: true,
            useQuery: false,
          },
          mutator: {
            path: "./src/mutator/custom-instance.ts",
            name: "customInstance",
          },
        },
      },
      hooks: {
        afterAllFilesWrite: "prettier --write",
      },
    };
  }
});

export default defineConfig(apis);
