import { Injectable } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import type {
  DeleteProductVariantParams,
  GetProductVariantsQueryParams,
  GetProductVariants200Response,
  GetProductVariantByIdParams,
  GetProductVariantById200Response,
  PatchProductVariantParams,
  PatchProductVariantBody,
  PostProductVariantBody,
  PostProductVariant201Response,
} from '@e-commerce/api-validation/types/product';
import { BaseProductVariantsControllerInterface } from '@generated-controller/product/product-variants/base-product-variants.controller.interface';

@Injectable()
export class ProductVariantsController implements BaseProductVariantsControllerInterface {
  constructor(private readonly service: ProductVariantsService) {}

  /**
   * DELETE /v1/product-variants/:productVariantId
   */
  async deleteProductVariant(
    params: DeleteProductVariantParams,
  ): Promise<void> {
    await this.service.deleteProductVariant(params);
  }

  /**
   * GET /v1/product-variants
   */
  async getProductVariants(
    query: GetProductVariantsQueryParams,
  ): Promise<GetProductVariants200Response> {
    return await this.service.getProductVariants(query);
  }

  /**
   * GET /v1/product-variants/:productVariantId
   */
  async getProductVariantById(
    params: GetProductVariantByIdParams,
  ): Promise<GetProductVariantById200Response> {
    return await this.service.getProductVariantById(params);
  }

  /**
   * PATCH /v1/product-variants/:productVariantId
   */
  async patchProductVariant(
    params: PatchProductVariantParams,

    body: PatchProductVariantBody,
  ): Promise<void> {
    await this.service.patchProductVariant(
      params,

      body,
    );
  }

  /**
   * POST /v1/product-variants
   */
  async postProductVariant(
    body: PostProductVariantBody,
  ): Promise<PostProductVariant201Response> {
    return await this.service.postProductVariant(body);
  }
}
