import { PrismaService } from '@/common/services/prisma.service';
import {
  GetCategories200Response,
  GetCategoriesQueryParams,
  GetCategoryByCategoryId200Response,
  PatchCategoryBody,
  PostCategoryBody,
} from '@e-commerce/api-validation/types/product';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await this.prisma.categories.delete({
        where: { id: categoryId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async getCategories(
    query: GetCategoriesQueryParams,
  ): Promise<GetCategories200Response> {
    const whereClause = {
      name: query.categoryName,
      id: query.categoryId,
      slug: query.slug,
      parentId: query.parentId,
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
    const duplicateCount = await this.prisma.categories.count({
      where: { OR: [{ slug: data.slug }, { name: data.categoryName }] },
    });
    if (duplicateCount > 0) {
      throw new ConflictException('Category already exists');
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
