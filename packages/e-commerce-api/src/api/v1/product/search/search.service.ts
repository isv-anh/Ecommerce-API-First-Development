import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type {
  SearchProductsQueryParams,
  SearchProducts200Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseSearchControllerInterface } from '@generated-controller/product/search/base-search.controller.interface';
import * as grpc from '@grpc/grpc-js';
import { ProductServiceClient } from '@/buf/generated/product/v1/product';

import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class SearchService implements BaseSearchControllerInterface {
  private client: ProductServiceClient;

  constructor(private readonly prisma: PrismaService) {
    this.client = new ProductServiceClient(
      process.env.SEARCH_SERVICE_URL || 'localhost:50053',
      grpc.credentials.createInsecure(),
    );
  }

  async searchProducts(
    query: SearchProductsQueryParams,
  ): Promise<SearchProducts200Response> {
    let brandName: string | undefined;
    let categoryName: string | undefined;

    if (query.brandIds) {
      const brandId = query.brandIds.split(',')[0];
      const brand = await this.prisma.brands.findUnique({
        where: { id: brandId },
      });
      if (brand) brandName = brand.name;
    }

    if (query.categoryIds) {
      const categoryId = query.categoryIds.split(',')[0];
      const category = await this.prisma.categories.findUnique({
        where: { id: categoryId },
      });
      if (category) categoryName = category.name;
    }

    return new Promise((resolve, reject) => {
      this.client.searchProduct(
        {
          keyword: query.keyword,
          categoryName,
          brandName,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          page: query.page,
          pageSize: query.pageSize,
          sort: query.sortBy,
        },
        (error, response) => {
          if (error) {
            reject(new InternalServerErrorException(error.message));
            return;
          }

          // Map gRPC response to HTTP response
          resolve({
            totalCount: 0, // Ghi chú: e-commerce-search gRPC chưa trả về totalCount, nên tạm thời để 0 hoặc lấy từ field nếu có
            totalPages: 1, // Tương tự
            products: response.products.map((p) => ({
              productId: p.productId,
              productName: p.productName,
              categoryName: p.categoryName,
              thumbnailUrl: p.thumbnailUrl,
              location: 'TP. Hồ Chí Minh',
              price: p.price,
              slug: p.slug,
              isPublished: true,
            })),
          });
        },
      );
    });
  }
}
