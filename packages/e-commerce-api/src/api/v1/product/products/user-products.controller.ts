import { Public } from '@/common/decorators/public.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { getProductsQueryParams } from '@e-commerce/api-validation/zod/product';
import type {
  GetProducts200Response,
  GetProductsQueryParams,
} from '@e-commerce/api-validation/types/product';
import { ProductsService } from './products.service';

@Controller('/api/v1/user/products')
export class UserProductsController {
  constructor(private readonly service: ProductsService) {}

  @Public()
  @Get()
  @HttpCode(200)
  async getUserProducts(
    @Query(new ZodValidationPipe(getProductsQueryParams))
    query: GetProductsQueryParams,
  ): Promise<GetProducts200Response> {
    return await this.service.getUserProducts(query);
  }
}
