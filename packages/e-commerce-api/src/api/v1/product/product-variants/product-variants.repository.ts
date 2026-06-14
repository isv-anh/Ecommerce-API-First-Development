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
    const whereClause = {
      product_id: query.productId,
    };

    const variants = (
      await this.prisma.product_variants.findMany({
        where: whereClause,
      })
    ).map((variant) => ({
      productVariantId: variant.id,
      productId: variant.product_id,
      sku: variant.sku || '',
      thumbnailUrl: variant.thumbnail_url || '',
      price: Number(variant.price),
      comparePrice: variant.compare_price ? Number(variant.compare_price) : 0,
      stock: variant.stock || 0,
      createdAt: variant.created_at?.toISOString() || '',
      updatedAt: variant.updated_at?.toISOString() || '',
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
      createdAt: variant.created_at?.toISOString() || '',
      updatedAt: variant.updated_at?.toISOString() || '',
    };
  }

  async updateProductVariant(
    productVariantId: string,
    data: PatchProductVariantBody,
  ): Promise<void> {
    await this.prisma.product_variants.update({
      where: { id: productVariantId },
      data: {
        sku: data.sku,
        thumbnail_url: data.thumbnailUrl,
        price: data.price,
        compare_price: data.comparePrice,
        stock: data.stock,
      },
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
    await this.prisma.product_variants.create({
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
    return productVariantId;
  }
}
