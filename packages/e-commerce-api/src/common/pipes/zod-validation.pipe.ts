import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    const shouldCoerce = metadata.type === 'query';
    const input = shouldCoerce ? this.coerceQueryNumbers(value) : value;

    const result = this.schema.safeParse(input);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        target: issue.path.join('.'),
        message: issue.message,
      }));

      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        errors,
      });
    }

    return result.data;
  }

  private coerceQueryNumbers(value: unknown): unknown {
    if (typeof value !== 'object' || value === null) return value;

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        typeof v === 'string' && v !== '' && !isNaN(Number(v)) ? Number(v) : v,
      ]),
    );
  }
}
