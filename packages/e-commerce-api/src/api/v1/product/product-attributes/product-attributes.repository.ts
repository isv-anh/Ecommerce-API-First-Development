import { PrismaService } from '@/common/services/prisma.service';
import type {
  GetProductAttributes200Response,
  GetProductAttributesQueryParams,
  GetProductAttributeById200Response,
  PatchProductAttributeBody,
  PostProductAttributeBody,
  DeleteProductAttributeParams,
  GetProductAttributeByIdParams,
  PatchProductAttributeParams,
  PostProductAttribute201Response,
} from '@e-commerce/api-validation/types/product';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductAttributesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteProductAttribute(
    params: DeleteProductAttributeParams,
  ): Promise<void> {
    await this.prisma.product_attributes.delete({
      where: {
        product_id_attribute_id: {
          attribute_id: params.attributeId,
          product_id: params.productId,
        },
      },
    });
  }

  async getProductAttributes(
    query: GetProductAttributesQueryParams,
  ): Promise<GetProductAttributes200Response> {
    const attributes = (
      await this.prisma.product_attributes.findMany({
        where: { product_id: query.productId },
        select: {
          attributes: true,
          attribute_id: true,
          product_id: true,
        },
      })
    ).map((attribute) => ({
      productId: attribute.product_id,
      attributeId: attribute.attribute_id,
      attributeName: attribute.attributes.name,
    }));

    return { productAttributes: attributes };
  }

  async getProductAttributeById(
    params: GetProductAttributeByIdParams,
  ): Promise<GetProductAttributeById200Response> {
    const attribute = await this.prisma.product_attributes.findUnique({
      where: {
        product_id_attribute_id: {
          attribute_id: params.attributeId,
          product_id: params.productId,
        },
      },
      select: {
        attributes: true,
        attribute_id: true,
        product_id: true,
      },
    });
    if (!attribute) {
      throw new NotFoundException('Product Attribute not found');
    }
    return {
      productId: attribute.product_id,
      attributeId: attribute.attribute_id,
      attributeName: attribute.attributes.name,
    };
  }

  async updateProductAttribute(
    params: PatchProductAttributeParams,
    data: PatchProductAttributeBody,
  ): Promise<void> {
    await this.prisma.product_attributes.update({
      where: {
        product_id_attribute_id: {
          attribute_id: params.attributeId,
          product_id: params.productId,
        },
      },
      data: {
        attribute_id: data.attributeId,
      },
    });
  }

  async createProductAttribute(
    data: PostProductAttributeBody,
  ): Promise<PostProductAttribute201Response> {
    const { product_id, attribute_id } =
      await this.prisma.product_attributes.create({
        data: {
          product_id: data.productId,
          attribute_id: data.attributeId,
        },
      });
    return {
      productId: product_id,
      attributeId: attribute_id,
    };
  }
}
