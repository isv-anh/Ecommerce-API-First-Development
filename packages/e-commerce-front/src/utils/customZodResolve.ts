import {
  Resolver,
  ResolverResult,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";

/**
 * Convert a Zod schema into a custom React Hook Form resolver.
 *
 * @example
 * const resolver = customZodResolver(postLoginBody);
 * const { control, handleSubmit } = useForm<LoginRequest>({ resolver });
 *
 * @param schema - A Zod schema (e.g. `z.object({...})`)
 * @returns A Resolver function compatible with react-hook-form
 */
export const customZodResolver = <
  T extends z.ZodTypeAny,
  Schema extends FieldValues = z.infer<T> & FieldValues,
>(
  schema: T,
): Resolver<Schema> => {
  return async (values): Promise<ResolverResult<Schema>> => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data as unknown as Schema,
        errors: {},
      } as ResolverResult<Schema>;
    } else {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const formErrors: FieldErrors<Schema> = {};

      for (const key in fieldErrors) {
        const messages = fieldErrors[key];
        if (messages && messages.length > 0) {
          (formErrors as Record<string, any>)[key] = {
            type: "validation",
            message: messages[0],
          };
        }
      }

      return {
        values: {} as any,
        errors: formErrors,
      } as ResolverResult<Schema>;
    }
  };
};
