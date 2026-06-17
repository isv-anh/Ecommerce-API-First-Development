import { PrismaService } from '@/common/services/prisma.service';
import {
  GetProductVariants200Response,
  GetProductVariantsQueryParams,
  GetProductVariantById200Response,
  PatchProductVariantBody,
  PostProductVariantBody,
} from '@e-commerce/api-validation/types/product';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProductVariantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteProductVariant(productVariantId: string): Promise<void> {
    await this.prisma.product_variants.delete({
      where: { id: productVariantId },
    });
  }

  async getProductVariants(
    query: GetProductVariantsQueryParams,
  ): Promise<GetProductVariants200Response> {
    const variants = (
      await this.prisma.product_variants.findMany({
        where: {
          product_id: query.productId,
        },
        select: {
          compare_price: true,
          id: true,
          product_id: true,
          sku: true,
          price: true,
          stock: true,
          thumbnail_url: true,
          variant_attribute_values: {
            select: {
              value: true,
              attributes: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
    ).map((variant) => ({
      productVariantId: variant.id,
      productId: variant.product_id,
      sku: variant.sku || '',
      thumbnailUrl: variant.thumbnail_url || '',
      price: Number(variant.price),
      comparePrice: variant.compare_price ? Number(variant.compare_price) : 0,
      stock: variant.stock || 0,
      variantAttributes: variant.variant_attribute_values.map((v) => {
        return {
          attributeId: v.attributes.id,
          attributeName: v.attributes.name,
          attributeValue: v.value,
        };
      }),
    }));

    return {
      productVariants: variants,
    };
  }

  async getProductVariantById(
    productVariantId: string,
  ): Promise<GetProductVariantById200Response> {
    const variant = await this.prisma.product_variants.findUnique({
      where: { id: productVariantId },
      select: {
        compare_price: true,
        id: true,
        product_id: true,
        sku: true,
        price: true,
        stock: true,
        thumbnail_url: true,
        variant_attribute_values: {
          select: {
            value: true,
            attributes: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!variant) {
      throw new NotFoundException('Product Variant not found');
    }
    return {
      productVariantId: variant.id,
      productId: variant.product_id,
      sku: variant.sku || '',
      thumbnailUrl: variant.thumbnail_url || '',
      price: Number(variant.price),
      comparePrice: variant.compare_price ? Number(variant.compare_price) : 0,
      stock: variant.stock || 0,
      variantAttributes: variant.variant_attribute_values.map((v) => {
        return {
          attributeId: v.attributes.id,
          attributeName: v.attributes.name,
          attributeValue: v.value,
        };
      }),
    };
  }

  async updateProductVariant(
    productVariantId: string,
    data: PatchProductVariantBody,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.product_variants.update({
        where: { id: productVariantId },
        data: {
          sku: data.sku,
          thumbnail_url: data.thumbnailUrl,
          price: data.price,
          compare_price: data.comparePrice,
        },
      });

      if (data.variantAttributes) {
        await tx.variant_attribute_values.deleteMany({
          where: { product_variant_id: productVariantId },
        });

        if (data.variantAttributes.length > 0) {
          await tx.variant_attribute_values.createMany({
            data: data.variantAttributes.map((attr) => ({
              product_variant_id: productVariantId,
              attribute_id: attr.attributeId,
              value: attr.attributeValue,
            })),
          });
        }
      }
    });
  }

  async createProductVariant(data: PostProductVariantBody): Promise<string> {
    const productVariantId = crypto.randomUUID();
    const duplicateCount = await this.prisma.product_variants.count({
      where: { sku: data.sku },
    });
    if (duplicateCount > 0) {
      throw new ConflictException('SKU already exists');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product_variants.create({
        data: {
          id: productVariantId,
          product_id: data.productId,
          sku: data.sku,
          thumbnail_url: data.thumbnailUrl,
          price: data.price,
          compare_price: data.comparePrice,
          stock: 0,
        },
      });

      if (data.variantAttributes.length > 0) {
        await tx.variant_attribute_values.createMany({
          data: data.variantAttributes.map((attr) => ({
            product_variant_id: productVariantId,
            attribute_id: attr.attributeId,
            value: attr.attributeValue,
          })),
        });
      }
    });

    return productVariantId;
  }
}
