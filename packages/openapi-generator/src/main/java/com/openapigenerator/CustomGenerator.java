package com.openapigenerator;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openapitools.codegen.CodegenOperation;
import org.openapitools.codegen.CodegenResponse;
import org.openapitools.codegen.CodegenType;
import org.openapitools.codegen.DefaultCodegen;
import org.openapitools.codegen.model.ModelMap;
import org.openapitools.codegen.model.OperationsMap;

import com.samskivert.mustache.Mustache;

public class CustomGenerator extends DefaultCodegen {

    private final Map<String, List<CodegenOperation>> operationsByTag = new HashMap<>();

    public CustomGenerator() {
        super();
        outputFolder = "generated";
        templateDir = "templates";
    }

    @Override
    public CodegenType getTag() {
        return CodegenType.OTHER;
    }

    @Override
    public String getName() {
        return "custom-generator";
    }

    @Override
    public String getHelp() {
        return "Custom generator for generating code based on OpenAPI specifications.";
    }

    @Override
    public OperationsMap postProcessOperationsWithModels(
            OperationsMap objs, List<ModelMap> allModels) {

        OperationsMap results = super.postProcessOperationsWithModels(objs, allModels);
        List<CodegenOperation> ops = results.getOperations().getOperation();

        for (CodegenOperation op : ops) {

            String tag = op.tags.isEmpty()
                    ? "default"
                    : op.tags.get(0).getName();

            operationsByTag
                    .computeIfAbsent(tag, k -> new ArrayList<>())
                    .add(op);

            op.path = op.path.replaceAll("\\{", ":").replaceAll("}", "");

            // NestJS method
            String method = op.httpMethod.substring(0, 1).toUpperCase()
                    + op.httpMethod.substring(1).toLowerCase();

            op.vendorExtensions.put("x-nest-method", method);
            op.vendorExtensions.put("x-has-body", !op.bodyParams.isEmpty());
            op.vendorExtensions.put("x-has-query", !op.queryParams.isEmpty());
            op.vendorExtensions.put("x-has-param", !op.pathParams.isEmpty());

            // Type names matching api-validation naming convention
            String opPascal = capitalize(op.operationId);
            if (!op.pathParams.isEmpty()) {
                op.vendorExtensions.put("x-type-params", opPascal + "Params");
            }
            if (!op.queryParams.isEmpty()) {
                op.vendorExtensions.put("x-type-query", opPascal + "QueryParams");
            }
            if (!op.bodyParams.isEmpty()) {
                op.vendorExtensions.put("x-type-body", opPascal + "Body");
            }

            // Zod schemas for per-parameter ZodValidationPipe
            if (!op.bodyParams.isEmpty()) {
                op.vendorExtensions.put("x-zod-schema-body", op.operationId + "Body");
            }
            if (!op.queryParams.isEmpty()) {
                op.vendorExtensions.put("x-zod-schema-query", op.operationId + "QueryParams");
            }
            if (!op.pathParams.isEmpty()) {
                op.vendorExtensions.put("x-zod-schema-param", op.operationId + "Params");
            }

            // Success response type: find first 2xx response
            for (CodegenResponse response : op.responses) {
                if (response.code != null && response.code.startsWith("2")) {
                    if ("204".equals(response.code)) {
                        op.vendorExtensions.put("x-is-void", true);
                    } else {
                        op.vendorExtensions.put("x-type-response", opPascal + response.code + "Response");
                        op.vendorExtensions.put("x-is-void", false);
                    }
                    break;
                }
            }
        }

        return results;
    }

    @Override
    public Map<String, Object> postProcessSupportingFileData(Map<String, Object> objs) {
        // Derive spec name from input file (e.g. "product.json" → "product")
        String specName = new File(inputSpec).getName().replaceAll("\\.[^.]+$", "");

        try {
            for (Map.Entry<String, List<CodegenOperation>> entry : operationsByTag.entrySet()) {

                String tag = entry.getKey();
                List<CodegenOperation> ops = entry.getValue();

                String moduleName = toKebabCase(tag);

                Map<String, Object> data = new HashMap<>();
                data.put("operations", ops);
                data.put("moduleName", moduleName);
                data.put("className", toPascalCase(tag));
                data.put("upperCaseName", toUpperSnakeCase(tag));
                data.put("specName", specName);

                // Aggregate NestJS decorator flags across all operations in this module
                boolean hasGet = false, hasPost = false, hasPatch = false,
                        hasPut = false, hasDelete = false;
                boolean hasParam = false, hasQuery = false, hasBody = false;
                for (CodegenOperation op : ops) {
                    String method = op.httpMethod.toUpperCase();
                    if ("GET".equals(method))    hasGet    = true;
                    if ("POST".equals(method))   hasPost   = true;
                    if ("PATCH".equals(method))  hasPatch  = true;
                    if ("PUT".equals(method))    hasPut    = true;
                    if ("DELETE".equals(method)) hasDelete = true;
                    if (!op.pathParams.isEmpty())  hasParam = true;
                    if (!op.queryParams.isEmpty()) hasQuery = true;
                    if (!op.bodyParams.isEmpty())  hasBody  = true;
                }
                data.put("import-Get",    hasGet);
                data.put("import-Post",   hasPost);
                data.put("import-Patch",  hasPatch);
                data.put("import-Put",    hasPut);
                data.put("import-Delete", hasDelete);
                data.put("import-Param",  hasParam);
                data.put("import-Query",  hasQuery);
                data.put("import-Body",   hasBody);

                // generated-controller: base-controller + interface (read-only, committed to repo)
                String generatedPath = System.getProperty("generatedControllerPath", "/app/output/generated-controller")
                        + "/" + specName + "/" + moduleName;

                // custom: controller + module + service (editable by developer)
                String customPath = System.getProperty("customPath", "/app/output/custom")
                        + "/" + specName + "/" + moduleName;

                generateFile("base-controller-interface.mustache",
                        generatedPath + "/base-" + moduleName + ".controller.interface.ts", data);
                generateFile("base-controller.mustache",
                        generatedPath + "/base-" + moduleName + ".controller.ts", data);

                generateFile("controller.mustache", customPath + "/" + moduleName + ".controller.ts", data);
                generateFile("module.mustache", customPath + "/" + moduleName + ".module.ts", data);
                generateFile("service.mustache", customPath + "/" + moduleName + ".service.ts", data);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return super.postProcessSupportingFileData(objs);
    }

    /**
     * Generate a file from a Mustache template.
     *
     * <p>
     * This method loads a template file from the classpath, compiles it using
     * Mustache, and writes the rendered content to the specified output path.
     * </p>
     *
     * @param templateName the name of the template file (relative to templateDir)
     * @param outputPath   the full path where the generated file will be written
     * @param data         the data model used to render the Mustache template
     * @throws IOException if the template cannot be read or the file cannot be
     *                     written
     */
    private void generateFile(String templateName, String outputPath,
            Map<String, Object> data) throws IOException {
        InputStream is = getClass().getClassLoader()
                .getResourceAsStream(templateDir + "/" + templateName);
        String templateStr = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        String content = Mustache.compiler().compile(templateStr).execute(data);

        File out = new File(outputPath);
        out.getParentFile().mkdirs();
        try (FileWriter w = new FileWriter(out)) {
            w.write(content);
        }
    }

    /**
     * Converts a string to PascalCase.
     *
     * <p>
     * Splits the input string by hyphens (-), underscores (_), or spaces,
     * then capitalizes the first letter of each segment and joins them together.
     * </p>
     *
     * <p>
     * Examples:
     * </p>
     * <ul>
     * <li>"customer-reviews" → "CustomerReviews"</li>
     * <li>"user_profile" → "UserProfile"</li>
     * <li>"order item" → "OrderItem"</li>
     * </ul>
     *
     * @param str the input string
     * @return the PascalCase version of the string, or the original string if
     *         null/empty
     */
    private String toPascalCase(String str) {
        if (str == null || str.isEmpty())
            return str;

        String[] parts = str.split("[-_\\s]+"); // tách theo -, _, space
        StringBuilder result = new StringBuilder();

        for (String part : parts) {
            if (part.isEmpty())
                continue;
            result.append(part.substring(0, 1).toUpperCase())
                    .append(part.substring(1));
        }

        return result.toString();
    }

    /**
     * Capitalizes the first character of a string.
     *
     * <p>
     * This method only affects the first character and does not modify
     * the rest of the string.
     * </p>
     *
     * <p>
     * Example:
     * </p>
     * <ul>
     * <li>"hello" → "Hello"</li>
     * </ul>
     *
     * @param str the input string
     * @return the string with the first character uppercased, or original if
     *         null/empty
     */
    private String capitalize(String str) {
        if (str == null || str.isEmpty())
            return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * Converts a string to UPPER_SNAKE_CASE.
     *
     * <p>
     * Examples:
     * </p>
     * <ul>
     * <li>"customer-reviews" → "CUSTOMER_REVIEWS"</li>
     * <li>"orderItem" → "ORDER_ITEM"</li>
     * </ul>
     *
     * @param str the input string
     * @return the UPPER_SNAKE_CASE version of the string
     */
    private String toUpperSnakeCase(String str) {
        if (str == null || str.isEmpty())
            return str;

        return str
                .replaceAll("([a-z])([A-Z])", "$1_$2") // camelCase → camel_Case
                .replaceAll("[-\\s]+", "_")             // kebab-case / space → _
                .toUpperCase();
    }

    /**
     * Converts a string to kebab-case.
     *
     * <p>
     * This method transforms camelCase, snake_case, or space-separated strings
     * into kebab-case (lowercase words separated by hyphens).
     * </p>
     *
     * <p>
     * Examples:
     * </p>
     * <ul>
     * <li>"customerReviews" → "customer-reviews"</li>
     * <li>"user_profile" → "user-profile"</li>
     * <li>"Order Item" → "order-item"</li>
     * </ul>
     *
     * @param str the input string
     * @return the kebab-case version of the string, or the original string if
     *         null/empty
     */
    private String toKebabCase(String str) {
        if (str == null || str.isEmpty())
            return str;

        return str
                .replaceAll("([a-z])([A-Z])", "$1-$2") // camelCase → camel-Case
                .replaceAll("[_\\s]+", "-") // snake_case / space → -
                .toLowerCase();
    }
}