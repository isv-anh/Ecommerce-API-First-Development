import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import type {
  DeleteProductParams,
  GetProductsQueryParams,
  GetProducts200Response,
  GetProductByProductIdParams,
  GetProductByProductId200Response,
  PatchProductParams,
  PatchProductBody,
  PostProductBody,
  PostProduct201Response,
} from '@e-commerce/api-validation/types/product';
import { BaseProductsControllerInterface } from '@generated-controller/product/products/base-products.controller.interface';

@Injectable()
export class ProductsController implements BaseProductsControllerInterface {
  constructor(private readonly service: ProductsService) {}

  /**
   * DELETE /v1/products/:productId
   */
  async deleteProduct(params: DeleteProductParams): Promise<void> {
    await this.service.deleteProduct(params);
  }

  /**
   * GET /v1/products
   */
  async getProducts(
    query: GetProductsQueryParams,
  ): Promise<GetProducts200Response> {
    return await this.service.getProducts(query);
  }

  /**
   * GET /v1/products/:productId
   */
  async getProductByProductId(
    params: GetProductByProductIdParams,
  ): Promise<GetProductByProductId200Response> {
    return await this.service.getProductByProductId(params);
  }

  /**
   * PATCH /v1/products/:productId
   */
  async patchProduct(
    params: PatchProductParams,

    body: PatchProductBody,
  ): Promise<void> {
    await this.service.patchProduct(
      params,

      body,
    );
  }

  /**
   * POST /v1/products
   */
  async postProduct(body: PostProductBody): Promise<PostProduct201Response> {
    return await this.service.postProduct(body);
  }
}
