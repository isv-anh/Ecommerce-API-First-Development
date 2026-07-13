import { Injectable } from '@nestjs/common';
import type {
  GetUserProductsQueryParams,
  GetUserProducts200Response,
  GetProductsQueryParams,
} from '@e-commerce/api-validation/types/product';
import type { BaseUserProductsControllerInterface } from '@generated-controller/product/user-products/base-user-products.controller.interface';
import { ProductsRepository } from '@/api/v1/product/products/products.repository';

@Injectable()
export class UserProductsService
  implements BaseUserProductsControllerInterface
{
  constructor(private readonly productsRepository: ProductsRepository) {}

  /**
   * GET /api/v1/user/products
   *
   * Retrieves products for users, filtering to only published ones.
   *
   * @param query - Query parameters typed as {@link GetUserProductsQueryParams}
   * @returns {@link GetUserProducts200Response}
   */
  async getUserProducts(
    query: GetUserProductsQueryParams,
  ): Promise<GetUserProducts200Response> {
    return await this.productsRepository.getUserProducts(
      query as GetProductsQueryParams,
    );
  }
}
