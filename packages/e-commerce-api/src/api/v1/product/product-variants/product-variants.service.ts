import { Injectable } from '@nestjs/common';
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
import type { BaseProductVariantsControllerInterface } from '@generated-controller/product/product-variants/base-product-variants.controller.interface';
import { ProductVariantsRepository } from '@/api/v1/product/product-variants/product-variants.repository';

@Injectable()
export class ProductVariantsService
  implements BaseProductVariantsControllerInterface
{
  constructor(
    private readonly productVariantsRepository: ProductVariantsRepository,
  ) {}

  /**
   * DELETE /v1/product-variants/:productVariantId
   */
  async deleteProductVariant(
    params: DeleteProductVariantParams,
  ): Promise<void> {
    await this.productVariantsRepository.deleteProductVariant(
      params.productVariantId,
    );
  }

  /**
   * GET /v1/product-variants
   */
  async getProductVariants(
    query: GetProductVariantsQueryParams,
  ): Promise<GetProductVariants200Response> {
    return await this.productVariantsRepository.getProductVariants(query);
  }

  /**
   * GET /v1/product-variants/:productVariantId
   */
  async getProductVariantById(
    params: GetProductVariantByIdParams,
  ): Promise<GetProductVariantById200Response> {
    return await this.productVariantsRepository.getProductVariantById(
      params.productVariantId,
    );
  }

  /**
   * PATCH /v1/product-variants/:productVariantId
   */
  async patchProductVariant(
    params: PatchProductVariantParams,

    body: PatchProductVariantBody,
  ): Promise<void> {
    await this.productVariantsRepository.updateProductVariant(
      params.productVariantId,
      body,
    );
  }

  /**
   * POST /v1/product-variants
   */
  async postProductVariant(
    body: PostProductVariantBody,
  ): Promise<PostProductVariant201Response> {
    const productVariantId =
      await this.productVariantsRepository.createProductVariant(body);
    return { productVariantId };
  }
}
