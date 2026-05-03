import { Injectable } from '@nestjs/common';
import { CategoriesService } from './categories.service';
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
import { BaseCategoriesControllerInterface } from '@generated-controller/product/categories/base-categories.controller.interface';

@Injectable()
export class CategoriesController implements BaseCategoriesControllerInterface {
  constructor(private readonly service: CategoriesService) {}

  /**
   * DELETE /v1/categories/:categoryId
   */
  async deleteCategory(params: DeleteCategoryParams): Promise<void> {
    await this.service.deleteCategory(params);
  }

  /**
   * GET /v1/categories
   */
  async getCategories(
    query: GetCategoriesQueryParams,
  ): Promise<GetCategories200Response> {
    return await this.service.getCategories(query);
  }

  /**
   * GET /v1/categories/:categoryId
   */
  async getCategoryByCategoryId(
    params: GetCategoryByCategoryIdParams,
  ): Promise<GetCategoryByCategoryId200Response> {
    return await this.service.getCategoryByCategoryId(params);
  }

  /**
   * PATCH /v1/categories/:categoryId
   */
  async patchCategory(
    params: PatchCategoryParams,

    body: PatchCategoryBody,
  ): Promise<void> {
    await this.service.patchCategory(
      params,

      body,
    );
  }

  /**
   * POST /v1/categories
   */
  async postCategory(body: PostCategoryBody): Promise<PostCategory201Response> {
    return await this.service.postCategory(body);
  }
}
