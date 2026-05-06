import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

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
}
