import { z } from "zod";

/**
 * Unwraps a Zod schema by stripping outer Optional, Default, and Nullable wrappers
 * until the inner type is reached.
 *
 * @param schema - The Zod schema to unwrap.
 * @returns The innermost Zod schema without Optional/Default/Nullable wrappers.
 */
function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  while (true) {
    if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
      schema = schema.unwrap() as z.ZodTypeAny;
      continue;
    }

    if (schema instanceof z.ZodDefault) {
      schema = schema.removeDefault() as z.ZodTypeAny;
      continue;
    }

    return schema;
  }
}

/**
 * Parses a `URLSearchParams` instance into a typed object validated by a Zod schema.
 *
 * Since URL search params are always strings, this function reads each field
 * according to its schema type — using `getAll` for array fields and `get` for scalars —
 * then passes the collected values through `schema.parse` for validation and coercion.
 *
 * @template T - The inferred output type of the provided schema.
 * @param searchParams - The `URLSearchParams` to read values from.
 * @param schema - A Zod schema (must be a `ZodObject`) describing the expected shape.
 * @returns The parsed and validated object of type `T`.
 *
 * @example
 * const schema = z.object({ page: z.coerce.number().default(1), tags: z.array(z.string()) });
 * const result = parseSearchParams(new URLSearchParams("page=2&tags=a&tags=b"), schema);
 * // result => { page: 2, tags: ["a", "b"] }
 */
export function parseSearchParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T,
): z.infer<T> {
  if (!(schema instanceof z.ZodObject)) {
    return schema.parse({} as unknown);
  }

  const result: Record<string, unknown> = {};

  const shape = schema.shape;

  for (const key in shape) {
    const field = unwrapSchema(shape[key]);

    if (field instanceof z.ZodArray) {
      const values = searchParams.getAll(key);

      if (values.length > 0) {
        result[key] = values;
      }

      continue;
    }

    const value = searchParams.get(key);

    if (value !== null) {
      result[key] = value;
    }
  }

  // validate whole object
  const parsed = schema.safeParse(result);

  if (parsed.success) {
    return parsed.data;
  }

  // remove invalid fields
  const cleaned: Record<string, unknown> = {};

  for (const key in shape) {
    const fieldResult = shape[key].safeParse(result[key]);

    if (fieldResult.success) {
      cleaned[key] = fieldResult.data;
    }
  }

  return schema.parse(cleaned);
}

/**
 * Serializes a plain object into a `URLSearchParams` instance.
 *
 * - `null`, `undefined`, and empty string values are omitted.
 * - Array values are appended as multiple entries under the same key.
 * - All other values are coerced to strings via `String()`.
 *
 * @param params - A record of key-value pairs to serialize.
 * @returns A `URLSearchParams` instance representing the given params.
 *
 * @example
 * const sp = serializeSearchParams({ page: 2, tags: ["a", "b"], q: "" });
 * sp.toString(); // "page=2&tags=a&tags=b"
 */
export function serializeSearchParams(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, String(item));
      });

      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams;
}
