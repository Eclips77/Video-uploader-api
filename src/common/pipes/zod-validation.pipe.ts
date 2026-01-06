import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
        const result = this.schema.safeParse(value);
        if (!result.success) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: result.error.format(),
            });
        }
        return result.data;
    }
    return value;
  }
}
