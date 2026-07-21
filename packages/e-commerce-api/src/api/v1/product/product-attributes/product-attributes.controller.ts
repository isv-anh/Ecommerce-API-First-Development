import { Injectable } from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import type {
  DeleteProductAttributeParams,
  GetProductAttributeByIdParams,
  GetProductAttributeById200Response,
  GetProductAttributesQueryParams,
  GetProductAttributes200Response,
  PatchProductAttributeParams,
  PatchProductAttributeBody,
  PostProductAttributeBody,
  PostProductAttribute201Response,
} from '@e-commerce/api-validation/types/product';
import { BaseProductAttributesControllerInterface } from '@generated-controller/product/product-attributes/base-product-attributes.controller.interface';

@Injectable()
export class ProductAttributesController implements BaseProductAttributesControllerInterface {
  constructor(private readonly service: ProductAttributesService) {}

  /**
   * DELETE /api/v1/product-attributes/:productAttributeId
   */
  async deleteProductAttribute(
    params: DeleteProductAttributeParams,
  ): Promise<void> {
    await this.service.deleteProductAttribute(params);
  }

  /**
   * GET /api/v1/product-attributes/:productAttributeId
   */
  async getProductAttributeById(
    params: GetProductAttributeByIdParams,
  ): Promise<GetProductAttributeById200Response> {
    return await this.service.getProductAttributeById(params);
  }

  /**
   * GET /api/v1/product-attributes
   */
  async getProductAttributes(
    query: GetProductAttributesQueryParams,
  ): Promise<GetProductAttributes200Response> {
    return await this.service.getProductAttributes(query);
  }

  /**
   * PATCH /api/v1/product-attributes/:productAttributeId
   */
  async patchProductAttribute(
    params: PatchProductAttributeParams,

    body: PatchProductAttributeBody,
  ): Promise<void> {
    await this.service.patchProductAttribute(
      params,

      body,
    );
  }

  /**
   * POST /api/v1/product-attributes
   */
  async postProductAttribute(
    body: PostProductAttributeBody,
  ): Promise<PostProductAttribute201Response> {
    return await this.service.postProductAttribute(body);
  }
}
