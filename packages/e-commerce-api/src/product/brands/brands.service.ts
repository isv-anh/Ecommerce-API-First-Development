import { Injectable } from '@nestjs/common';
import type {
  DeleteBrandParams,
  GetBrandByBrandIdParams,
  GetBrandByBrandId200Response,
  GetBrandsQueryParams,
  GetBrands200Response,
  PatchBrandParams,
  PatchBrandBody,
  PostBrandBody,
  PostBrand201Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseBrandsControllerInterface } from '@generated-controller/product/brands/base-brands.controller.interface';
import { BrandsRepository } from '@/product/brands/brands.repository';

@Injectable()
export class BrandsService implements BaseBrandsControllerInterface {
  constructor(private readonly brandsRepository: BrandsRepository) {}
  /**
   * DELETE /v1/brands/:brandId
   *
   * @param params - Path parameters typed as {@link DeleteBrandParams}
   * @returns void
   */
  async deleteBrand(params: DeleteBrandParams): Promise<void> {
    await this.brandsRepository.deleteBrand(params.brandId);
  }

  /**
   * GET /v1/brands/:brandId
   *
   * @param params - Path parameters typed as {@link GetBrandByBrandIdParams}
   * @returns {@link GetBrandByBrandId200Response}
   */
  async getBrandByBrandId(
    params: GetBrandByBrandIdParams,
  ): Promise<GetBrandByBrandId200Response> {
    return await this.brandsRepository.getBrandById(params.brandId);
  }

  /**
   * GET /v1/brands
   *
   * @param query - Query parameters typed as {@link GetBrandsQueryParams}
   * @returns {@link GetBrands200Response}
   */
  async getBrands(query: GetBrandsQueryParams): Promise<GetBrands200Response> {
    return await this.brandsRepository.getBrands(query);
  }

  /**
   * PATCH /v1/brands/:brandId
   *
   * @param params - Path parameters typed as {@link PatchBrandParams}
   * @param body - Request body typed as {@link PatchBrandBody}
   * @returns void
   */
  async patchBrand(
    params: PatchBrandParams,

    body: PatchBrandBody,
  ): Promise<void> {
    await this.brandsRepository.updateBrand(params.brandId, body);
  }

  /**
   * POST /v1/brands
   *
   * @param body - Request body typed as {@link PostBrandBody}
   * @returns {@link PostBrand201Response}
   */
  async postBrand(body: PostBrandBody): Promise<PostBrand201Response> {
    const brandId = await this.brandsRepository.createBrand(body);
    return { brandId };
  }
}
