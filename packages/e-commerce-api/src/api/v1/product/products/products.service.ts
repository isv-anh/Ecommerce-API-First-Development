import { Injectable } from '@nestjs/common';
import type {
  DeleteProductParams,
  GetProductRequestParams,
  GetProducts200Response,
  GetProductByProductIdParams,
  GetProductByProductId200Response,
  PatchProductParams,
  PatchProductRequestBody,
  PostProductRequestBody,
  PostProduct201Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseProductsControllerInterface } from '@generated-controller/product/products/base-products.controller.interface';
import { ProductsRepository } from '@/api/v1/product/products/products.repository';

@Injectable()
export class ProductsService implements BaseProductsControllerInterface {
  constructor(private readonly productsRepository: ProductsRepository) {}

  /**
   * DELETE /v1/products/:productId
   *
   * @param params - Path parameters typed as {@link DeleteProductParams}
   * @returns void
   */
  async deleteProduct(params: DeleteProductParams): Promise<void> {
    await this.productsRepository.deleteProduct(params.productId);
  }

  /**
   * GET /v1/products
   *
   * @param query - Query parameters typed as {@link GetProductRequestParams}
   * @returns {@link GetProducts200Response}
   */
  async getProducts(
    query: GetProductRequestParams,
  ): Promise<GetProducts200Response> {
    return await this.productsRepository.getProducts(query);
  }

  /**
   * GET /v1/products/:productId
   *
   * @param params - Path parameters typed as {@link GetProductByProductIdParams}
   * @returns {@link GetProductByProductId200Response}
   */
  async getProductByProductId(
    params: GetProductByProductIdParams,
  ): Promise<GetProductByProductId200Response> {
    return await this.productsRepository.getProductById(params.productId);
  }

  /**
   * PATCH /v1/products/:productId
   *
   * @param params - Path parameters typed as {@link PatchProductParams}
   * @param body - Request body typed as {@link PatchProductRequestBody}
   * @returns void
   */
  async patchProduct(
    params: PatchProductParams,

    body: PatchProductRequestBody,
  ): Promise<void> {
    await this.productsRepository.updateProduct(params.productId, body);
  }

  /**
   * POST /v1/products
   *
   * @param body - Request body typed as {@link PostProductRequestBody}
   * @returns {@link PostProduct201Response}
   */
  async postProduct(
    body: PostProductRequestBody,
  ): Promise<PostProduct201Response> {
    const productId = await this.productsRepository.createProduct(body);
    return { productId };
  }
}
