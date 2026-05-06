import { PrismaService } from '@/common/services/prisma.service';
import { parseSort } from '@/utils/parse-sort';
import {
  GetCategories200Response,
  GetCategoriesQueryParams,
  GetCategoryByCategoryId200Response,
  PatchCategoryBody,
  PostCategoryBody,
} from '@e-commerce/api-validation/types/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteCategory(categoryId: string): Promise<void> {
    await this.prisma.categories.delete({
      where: { id: categoryId },
    });
  }

  async getCategories(
    query: GetCategoriesQueryParams,
  ): Promise<GetCategories200Response> {
    const whereClause: Prisma.categoriesWhereInput = {
      ...(query.categoryName && {
        name: {
          contains: query.categoryName,
          mode: 'insensitive',
        },
      }),
      ...(query.slug && {
        slug: {
          contains: query.slug,
          mode: 'insensitive',
        },
      }),
      ...(query.parentId && {
        parent_id: query.parentId,
      }),
    };

    const categories = (
      await this.prisma.categories.findMany({
        where: whereClause,
        orderBy: parseSort(query.orderBy) || [{ id: 'asc' }],
        take: query.pageSize,
        skip: query.pageSize * (query.page - 1),
      })
    ).map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      parentId: category.parent_id || undefined,
      slug: category.slug,
    }));

    const totalCount = await this.prisma.categories.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalCount / query.pageSize);
    return {
      categories,
      totalCount,
      totalPages,
    };
  }

  async getCategoryById(
    categoryId: string,
  ): Promise<GetCategoryByCategoryId200Response> {
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      categoryId: category.id,
      categoryName: category.name,
      parentId: category.parent_id || undefined,
      slug: category.slug,
    };
  }

  async updateCategory(
    categoryId: string,
    data: PatchCategoryBody,
  ): Promise<void> {
    await this.prisma.categories.update({
      where: { id: categoryId },
      data: {
        name: data.categoryName,
        parent_id: data.parentId,
        slug: data.slug,
      },
    });
  }

  async createCategory(data: PostCategoryBody): Promise<string> {
    const categoryId = crypto.randomUUID();

    await this.prisma.categories.create({
      data: {
        id: categoryId,
        name: data.categoryName,
        parent_id: data.parentId,
        slug: data.slug,
      },
    });

    return categoryId;
  }
}
