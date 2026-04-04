import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';

import { z } from 'zod';
import { listPetsResponseItem } from '@e-commerce/api-validation/zod/petstore';
import type { ListPetsResponse } from '@e-commerce/api-validation/types/petstore';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;

@Controller('cats')
export class CatsController {
  @Post()
  @UsePipes(new ZodValidationPipe(listPetsResponseItem))
  create(@Body() createCatDto: ListPetsResponse): ListPetsResponse {
    return createCatDto;
  }
}
