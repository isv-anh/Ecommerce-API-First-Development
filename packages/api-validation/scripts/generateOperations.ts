/// <reference types="node" />
import fs from "node:fs";
import path from "node:path";

const OPENAPI_DIR = "../../docs/openapi";
const OUTPUT = "./src/operations/operations.ts";

function getJsonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getJsonFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      return [fullPath];
    }

    return [];
  });
}

const operations = new Set<string>();

const files = getJsonFiles(OPENAPI_DIR);

for (const file of files) {
  const openapi = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const pathItem of Object.values<any>(openapi.paths ?? {})) {
    for (const operation of Object.values<any>(pathItem)) {
      if (operation?.operationId) {
        operations.add(operation.operationId);
      }
    }
  }
}

const sortedOperations = [...operations].sort();

const content = `/* AUTO-GENERATED FILE */
/* DO NOT EDIT MANUALLY */

export const OPERATIONS = ${JSON.stringify(sortedOperations, null, 2)} as const;

export type Operation =
  (typeof OPERATIONS)[number];
`;

fs.mkdirSync("./src/operations", {
  recursive: true,
});

fs.writeFileSync(OUTPUT, content);

console.log(`Generated ${sortedOperations.length} operations`);
