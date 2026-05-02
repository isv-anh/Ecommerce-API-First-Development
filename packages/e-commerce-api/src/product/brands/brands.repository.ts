import { PrismaService } from '@/common/services/prisma.service';
import {
  GetBrandByBrandId200Response,
  GetBrands200Response,
  GetBrandsQueryParams,
  PatchBrandBody,
  PostBrandBody,
} from '@e-commerce/api-validation/types/product';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class BrandsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteBrand(brandId: string): Promise<void> {
    try {
      await this.prisma.brands.delete({
        where: { id: brandId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Brand not found');
      }
      throw error;
    }
  }

  async getBrands(query: GetBrandsQueryParams): Promise<GetBrands200Response> {
    const whereClause = {
      name: query.brandName,
      id: query.brandId,
      slug: query.slug,
    };

    const brands = (
      await this.prisma.brands.findMany({
        where: whereClause,
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
    const duplicateCount = await this.prisma.brands.count({
      where: { OR: [{ slug: data.slug }, { name: data.brandName }] },
    });
    if (duplicateCount > 0) {
      throw new ConflictException('Brand already exists');
    }
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
