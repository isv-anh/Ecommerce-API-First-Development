import { PrismaService } from '@/common/services/prisma.service';
import {
  GetProducts200Response,
  GetProductsQueryParams,
  GetProductByProductId200Response,
  PatchProductBody,
  PostProductBody,
} from '@e-commerce/api-validation/types/product';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.prisma.products.delete({
        where: { id: productId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async getProducts(
    query: GetProductsQueryParams,
  ): Promise<GetProducts200Response> {
    const whereClause = {
      name: query.productName,
      id: query.productId,
      category_id: query.categoryId,
      shop_id: query.shopId,
    };

    const productsResult = await this.prisma.products.findMany({
      where: whereClause,
      include: {
        categories: true,
        shops: true,
      },
      take: query.pageSize,
      skip: query.pageSize * (query.page - 1),
    });

    const products = productsResult.map((product) => ({
      productId: product.id,
      productName: product.name,
      categoryName: product.categories?.name || 'Uncategorized',
      thumbnailUrl: product.thumbnail_url || '',
      shopName: product.shops?.name || 'Unknown Shop',
      shopLogo: product.shops?.logo_url || '',
      location: 'Unknown', // Missing in schema
      price: 0, // Should come from variants, defaulting to 0 for now based on typespec
      slug: product.slug || '',
    }));

    // const totalCount = await this.prisma.products.count({
    //   where: whereClause,
    // });
    // const totalPages = Math.ceil(totalCount / query.pageSize);
    return {
      products,
    };
  }

  async getProductById(
    productId: string,
  ): Promise<GetProductByProductId200Response> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        shops: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      productId: product.id,
      productName: product.name,
      categoryName: product.categories?.name || 'Uncategorized',
      thumbnailUrl: product.thumbnail_url || '',
      shopName: product.shops?.name || 'Unknown Shop',
      shopLogo: product.shops?.logo_url || '',
      location: 'Unknown',
      price: 0,
      slug: product.slug || '',
    };
  }

  async updateProduct(
    productId: string,
    data: PatchProductBody,
  ): Promise<void> {
    await this.prisma.products.update({
      where: { id: productId },
      data: {
        name: data.productName,
        description: data.description,
        category_id: data.categoryId,
        slug: data.slug,
      },
    });
  }

  async createProduct(data: PostProductBody): Promise<string> {
    const productId = crypto.randomUUID();
    const duplicateCount = await this.prisma.products.count({
      where: { slug: data.slug },
    });
    if (duplicateCount > 0) {
      throw new ConflictException('Product already exists');
    }
    await this.prisma.products.create({
      data: {
        id: productId,
        name: data.productName,
        description: data.description,
        category_id: data.categoryId,
        slug: data.slug,
        shop_id: '00000000-0000-0000-0000-000000000000', // Mock shop ID since API request doesn't provide it
        is_published: true,
      },
    });
    return productId;
  }
}
