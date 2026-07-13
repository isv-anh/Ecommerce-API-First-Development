import { Injectable } from '@nestjs/common';
import type {
  GetUserProductsQueryParams,
  GetUserProducts200Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseUserProductsControllerInterface } from '@generated-controller/product/user-products/base-user-products.controller.interface';
import { UserProductsService } from '@/api/v1/product/user-products/user-products.service';

@Injectable()
export class UserProductsController
  implements BaseUserProductsControllerInterface
{
  constructor(private readonly service: UserProductsService) {}

  /**
   * GET /api/v1/user/products
   */
  async getUserProducts(
    query: GetUserProductsQueryParams,
  ): Promise<GetUserProducts200Response> {
    return await this.service.getUserProducts(query);
  }
}
