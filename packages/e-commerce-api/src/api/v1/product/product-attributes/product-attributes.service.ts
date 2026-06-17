import { Injectable, ConflictException } from '@nestjs/common';
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

import type { BaseProductAttributesControllerInterface } from '@generated-controller/product/product-attributes/base-product-attributes.controller.interface';

import { ProductAttributesRepository } from './product-attributes.repository';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class ProductAttributesService
  implements BaseProductAttributesControllerInterface
{
  constructor(
    private readonly productAttributesRepository: ProductAttributesRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * DELETE /api/v1/product-attributes/:productAttributeId
   */
  async deleteProductAttribute(
    params: DeleteProductAttributeParams,
  ): Promise<void> {
    await this.productAttributesRepository.deleteProductAttribute(params);
  }

  /**
   * GET /api/v1/product-attributes/:productAttributeId
   */
  async getProductAttributeById(
    params: GetProductAttributeByIdParams,
  ): Promise<GetProductAttributeById200Response> {
    return this.productAttributesRepository.getProductAttributeById(params);
  }

  /**
   * GET /api/v1/product-attributes
   */
  async getProductAttributes(
    query: GetProductAttributesQueryParams,
  ): Promise<GetProductAttributes200Response> {
    return this.productAttributesRepository.getProductAttributes(query);
  }

  /**
   * PATCH /api/v1/product-attributes/:productAttributeId
   */
  async patchProductAttribute(
    params: PatchProductAttributeParams,
    body: PatchProductAttributeBody,
  ): Promise<void> {
    /**
     * Check duplicate
     * productId + attributeId must be unique
     */
    const existed = await this.prisma.product_attributes.findUnique({
      where: {
        product_id_attribute_id: {
          product_id: params.productId,
          attribute_id: body.attributeId,
        },
      },
    });

    /**
     * Nếu tồn tại và khác record hiện tại
     */
    if (existed && existed.attribute_id !== params.attributeId) {
      throw new ConflictException('Product attribute already exists');
    }

    await this.productAttributesRepository.updateProductAttribute(params, body);
  }

  /**
   * POST /api/v1/product-attributes
   */
  async postProductAttribute(
    body: PostProductAttributeBody,
  ): Promise<PostProductAttribute201Response> {
    /**
     * Check duplicate
     */
    const existed = await this.prisma.product_attributes.findUnique({
      where: {
        product_id_attribute_id: {
          product_id: body.productId,
          attribute_id: body.attributeId,
        },
      },
    });

    if (existed) {
      throw new ConflictException('Product attribute already exists');
    }

    const productAttributeId =
      await this.productAttributesRepository.createProductAttribute(body);

    return productAttributeId;
  }
}
