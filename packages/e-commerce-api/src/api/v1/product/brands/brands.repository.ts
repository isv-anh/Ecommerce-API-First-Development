import { PrismaService } from '@/common/services/prisma.service';
import { parseSort } from '@/utils/parse-sort';
import {
  GetBrandByBrandId200Response,
  GetBrands200Response,
  GetBrandsQueryParams,
  PatchBrandBody,
  PostBrandBody,
} from '@e-commerce/api-validation/types/product';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class BrandsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteBrand(brandId: string): Promise<void> {
    await this.prisma.brands.delete({
      where: { id: brandId },
    });
  }

  async getBrands(query: GetBrandsQueryParams): Promise<GetBrands200Response> {
    const whereClause: Prisma.brandsWhereInput = {
      ...(query.brandName && {
        name: {
          contains: query.brandName,
          mode: 'insensitive',
        },
      }),
      ...(query.slug && {
        slug: {
          contains: query.slug,
          mode: 'insensitive',
        },
      }),
    };

    const brands = (
      await this.prisma.brands.findMany({
        where: whereClause,
        orderBy: parseSort(query.orderBy) || [{ id: 'asc' }],
        take: query.pageSize,
        skip: query.pageSize * (query.page - 1),
      })
    ).map((brand) => ({
      brandId: brand.id,
      brandName: brand.name,
      slug: brand.slug,
    }));

    const totalCount = await this.prisma.brands.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalCount / query.pageSize);
    return {
      brands,
      totalCount,
      totalPages,
    };
  }

  async getBrandById(brandId: string): Promise<GetBrandByBrandId200Response> {
    const brand = await this.prisma.brands.findUnique({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return {
      brandId: brand.id,
      brandName: brand.name,
      slug: brand.slug,
    };
  }

  async updateBrand(brandId: string, data: PatchBrandBody): Promise<void> {
    await this.prisma.brands.update({
      where: { id: brandId },
      data: {
        name: data.brandName,
        slug: data.slug,
      },
    });
  }

  async createBrand(data: PostBrandBody): Promise<string> {
    const brandId = crypto.randomUUID();

    await this.prisma.brands.create({
      data: {
        id: brandId,
        name: data.brandName,
        slug: data.slug,
      },
    });
    return brandId;
  }
}
