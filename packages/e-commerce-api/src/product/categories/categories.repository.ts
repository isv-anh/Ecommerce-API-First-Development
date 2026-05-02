import { PrismaService } from '@/common/services/prisma.service';
import {
  GetCategories200Response,
  GetCategoriesQueryParams,
  GetCategoryByCategoryId200Response,
  PatchCategoryBody,
  PostCategoryBody,
} from '@e-commerce/api-validation/types/product';
import { Injectable } from '@nestjs/common';

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
    const whereClause = {
      name: query.categoryName,
      id: query.categoryId,
      slug: query.slug,
    };

    const categories = (
      await this.prisma.categories.findMany({
        where: whereClause,
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
      throw new Error('Category not found');
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
      },
    });
  }

  async createCategory(data: PostCategoryBody): Promise<string> {
    const categoryId = crypto.randomUUID();
    const existingCategory = await this.prisma.categories.count({
      where: { OR: [{ slug: data.slug }, { name: data.categoryName }] },
    });
    if (existingCategory > 0) {
      throw new Error('Category already exists');
    }
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
