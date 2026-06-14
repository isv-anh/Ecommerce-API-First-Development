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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ProductsRepository {
  private logger = new Logger(ProductsRepository.name);

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

    const totalCount = await this.prisma.products.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / query.pageSize);

    return {
      totalCount,
      products,
      totalPages,
    };
  }

  async getProductById(
    productId: string,
  ): Promise<GetProductByProductId200Response> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true,
        brands: true,
        product_images: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      productId: product.id,
      productName: product.name,
      categoryId: product.categories?.id || '',
      thumbnailUrl: product.thumbnail_url || '',
      brandId: product.brand_id || undefined,
      description: product.description || '',
      images:
        product.product_images.map((img) => ({
          url: img.url ?? '',
        })) || [],
      slug: product.slug || '',
    };
  }

  async updateProduct(
    productId: string,
    data: PatchProductBody,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Kiểm tra product tồn tại
      const existing = await tx.products.findUnique({
        where: { id: productId },
        include: { product_images: true },
      });

      if (!existing) {
        throw new NotFoundException('Product not found');
      }

      // 2. Update các field của product
      await tx.products.update({
        where: { id: productId },
        data: {
          ...(data.productName != null && { name: data.productName }),
          ...(data.description != null && { description: data.description }),
          ...(data.categoryId != null && { category_id: data.categoryId }),
          ...(data.brandId != null && { brand_id: data.brandId }),
          ...(data.slug != null && { slug: data.slug }),
          ...(data.thumbnailUrl != null && {
            thumbnail_url: data.thumbnailUrl,
          }),
        },
      });

      // 3. Xử lý images theo diff (chỉ xóa/thêm những gì thay đổi)
      if (data.images != null) {
        const newUrls = new Set(data.images.map((img) => img.url));
        const oldImages = existing.product_images;
        const oldUrls = new Set(oldImages.map((img) => img.url));

        // Ảnh cần xóa: có trong DB nhưng không có trong danh sách mới
        const toDelete = oldImages.filter((img) => !newUrls.has(img.url ?? ''));

        // Ảnh cần thêm: có trong danh sách mới nhưng chưa có trong DB
        const toInsert = data.images.filter((img) => !oldUrls.has(img.url));

        if (toDelete.length > 0) {
          await tx.product_images.deleteMany({
            where: { id: { in: toDelete.map((img) => img.id) } },
          });
        }

        if (toInsert.length > 0) {
          await tx.product_images.createMany({
            data: toInsert.map((img) => ({
              id: crypto.randomUUID(),
              product_id: productId,
              url: img.url,
            })),
          });
        }
      }
    });
  }

  async createProduct(data: PostProductBody): Promise<string> {
    this.logger.log('Start save product');

    const productId = crypto.randomUUID();

    await this.prisma.$transaction(async (tx) => {
      this.logger.log('Start transaction');

      const duplicateCount = await tx.products.count({
        where: { slug: data.slug },
      });

      if (duplicateCount > 0) {
        throw new ConflictException('Product already exists');
      }

      await tx.products.create({
        data: {
          id: productId,
          brand_id: data.brandId,
          name: data.productName,
          description: data.description,
          category_id: data.categoryId,
          thumbnail_url: data.thumbnailUrl,
          slug: data.slug,
          shop_id: 'e1000000-0000-0000-0000-000000000001', // Mock shop ID since API request doesn't provide it
          is_published: false,
        },
      });

      this.logger.log('Save product success');

      if (data?.images && data.images.length > 0) {
        await tx.product_images.createMany({
          data: data.images.map((image) => ({
            id: crypto.randomUUID(),
            product_id: productId,
            url: image.url,
          })),
        });

        this.logger.log('Save product images success');
      }
    });

    this.logger.log('End save product');

    return productId;
  }
}
