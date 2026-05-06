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

    apis[`${name}-zod`] = {
      input: {
        target: path.join(inputDir, file),
      },
      output: {
        mode: "split",
        target: `./src/generated/zod/${name}.ts`,
        client: "zod",
        override: {
          zod: {
            generateEachHttpStatus: true,
          },
        },
      },
    };
  }
});

export default defineConfig(apis);
