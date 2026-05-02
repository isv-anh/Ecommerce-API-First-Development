import { Injectable } from '@nestjs/common';
import type {
  DeleteCategoryParams,
  GetCategoriesQueryParams,
  GetCategories200Response,
  GetCategoryByCategoryIdParams,
  GetCategoryByCategoryId200Response,
  PatchCategoryParams,
  PatchCategoryBody,
  PostCategoryBody,
  PostCategory201Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseCategoriesControllerInterface } from '@generated-controller/product/categories/base-categories.controller.interface';
import { CategoriesRepository } from '@/product/categories/categories.repository';

@Injectable()
export class CategoriesService implements BaseCategoriesControllerInterface {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  /**
   * DELETE /v1/categories/:categoryId
   *
   * @param params - Path parameters typed as {@link DeleteCategoryParams}
   * @returns void
   */
  async deleteCategory(params: DeleteCategoryParams): Promise<void> {
    await this.categoriesRepository.deleteCategory(params.categoryId);
  }

  /**
   * GET /v1/categories
   *
   * @param query - Query parameters typed as {@link GetCategoriesQueryParams}
   * @returns {@link GetCategories200Response}
   */
  async getCategories(
    query: GetCategoriesQueryParams,
  ): Promise<GetCategories200Response> {
    return await this.categoriesRepository.getCategories(query);
  }

  /**
   * GET /v1/categories/:categoryId
   *
   * @param params - Path parameters typed as {@link GetCategoryByCategoryIdParams}
   * @returns {@link GetCategoryByCategoryId200Response}
   */
  async getCategoryByCategoryId(
    params: GetCategoryByCategoryIdParams,
  ): Promise<GetCategoryByCategoryId200Response> {
    return await this.categoriesRepository.getCategoryById(params.categoryId);
  }

  /**
   * PATCH /v1/categories/:categoryId
   *
   * @param params - Path parameters typed as {@link PatchCategoryParams}
   * @param body - Request body typed as {@link PatchCategoryBody}
   * @returns void
   */
  async patchCategory(
    params: PatchCategoryParams,

    body: PatchCategoryBody,
  ): Promise<void> {
    await this.categoriesRepository.updateCategory(params.categoryId, body);
  }

  /**
   * POST /v1/categories
   *
   * @param body - Request body typed as {@link PostCategoryBody}
   * @returns {@link PostCategory201Response}
   */
  async postCategory(body: PostCategoryBody): Promise<PostCategory201Response> {
    const categoryId = await this.categoriesRepository.createCategory(body);
    return { categoryId };
  }
}
