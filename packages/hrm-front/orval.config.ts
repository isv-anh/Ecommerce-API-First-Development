import { ConfigExternal, defineConfig } from "orval";
import fs from "fs";
import path from "path";

const inputDir = "./openapi";

const apis: ConfigExternal = {};

fs.readdirSync(inputDir).forEach((file) => {
  if (file.endsWith(".yaml") || file.endsWith(".yml")) {
    const name = path.basename(file, path.extname(file));
    apis[name] = {
      input: {
        target: path.join(inputDir, file),
      },
      output: {
        mode: "split",
        target: `./src/generated/endpoints/${name}/${name}.ts`,
        schemas: `./src/generated/schemas/${name}`,
        client: "react-query",
        baseUrl: "http://localhost:8080/",
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
        },
      },
      hooks: {
        afterAllFilesWrite: "prettier --write",
      },
    };
  }
});

export default defineConfig(apis);
