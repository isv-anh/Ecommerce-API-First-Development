// scripts/generateZodTypes.ts
/// <reference types="node" />
import fs from "fs";
import path from "path";
import { Project, SyntaxKind, VariableDeclaration } from "ts-morph";

const zodDir = "./src/generated/zod";

const ZOD_IDENTIFIERS = new Set(["z", "zod"]);

const SKIP_SUFFIXES = ["Min", "Max", "RegExp", "QueryLimitMax"];

function isZodSchema(declaration: VariableDeclaration): boolean {
  const initializer = declaration.getInitializer();
  if (!initializer) return false;

  // Trường hợp 1: zod.xxx(...) hoặc z.xxx(...)
  const callExpr = initializer.asKind(SyntaxKind.CallExpression);
  if (callExpr) {
    const expr = callExpr.getExpression();

    // zod.object, z.string, etc.
    const propAccess = expr.asKind(SyntaxKind.PropertyAccessExpression);
    if (propAccess) {
      const obj = propAccess.getExpression().getText();
      if (ZOD_IDENTIFIERS.has(obj)) return true;
    }

    // baseSchema.extend(), baseSchema.merge(), baseSchema.pick(), etc.
    // → kiểm tra return type có phải ZodType không
    const returnType = declaration.getType();
    if (returnType.getText().includes("Zod")) return true;
  }

  // Trường hợp 2: multiline, type annotation tường minh
  const typeNode = declaration.getTypeNode();
  if (typeNode && typeNode.getText().includes("Zod")) return true;

  // Trường hợp 3: fallback kiểm tra type inference
  const type = declaration.getType();
  const typeText = type.getText();
  if (
    typeText.startsWith("zod.") ||
    typeText.startsWith("z.") ||
    typeText.includes("ZodType") ||
    typeText.includes("ZodSchema")
  ) {
    return true;
  }

  return false;
}

function shouldSkip(name: string): boolean {
  return SKIP_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTypeFile(filePath: string) {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sourceFile = project.addSourceFileAtPath(filePath);

  const schemaNames: string[] = [];

  sourceFile.getVariableDeclarations().forEach((declaration) => {
    const name = declaration.getName();
    if (shouldSkip(name)) return;

    // Chỉ lấy exported declarations
    const varStatement = declaration.getVariableStatement();
    if (!varStatement?.isExported()) return;

    if (isZodSchema(declaration)) {
      schemaNames.push(name);
    }
  });

  if (schemaNames.length === 0) {
    console.log(`⚠️  No schemas found in ${filePath}`);
    return;
  }

  const outputDir = "src/types";
  fs.mkdirSync(outputDir, { recursive: true }); // tạo folder nếu chưa có

  const baseName = path.basename(filePath, ".ts");
  const outputPath = path.join(outputDir, `${baseName}.ts`);

  const importLine = [
    `import { z as zod } from 'zod';`,
    `import type * as Schemas from`,
    `'../generated/zod/${baseName}.ts';`,
  ].join("\n");

  const typeExports = schemaNames
    .map(
      (name) =>
        `export type ${capitalize(name)} = zod.infer<typeof Schemas['${name}']>;`,
    )
    .join("\n");

  const content = `// Auto-generated. Do not edit manually.\n${importLine}\n\n${typeExports}\n`;

  fs.writeFileSync(outputPath, content);
  console.log(`✅ Generated ${outputPath} (${schemaNames.length} types)`);
}

fs.readdirSync(zodDir)
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".types.ts"))
  .forEach((file) => generateTypeFile(path.join(zodDir, file)));
