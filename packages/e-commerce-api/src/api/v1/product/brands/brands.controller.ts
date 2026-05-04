import { Injectable } from '@nestjs/common';
import { BrandsService } from './brands.service';
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
import { BaseBrandsControllerInterface } from '@generated-controller/product/brands/base-brands.controller.interface';

@Injectable()
export class BrandsController implements BaseBrandsControllerInterface {
  constructor(private readonly service: BrandsService) {}

  /**
   * DELETE /v1/brands/:brandId
   */
  async deleteBrand(params: DeleteBrandParams): Promise<void> {
    await this.service.deleteBrand(params);
  }

  /**
   * GET /v1/brands/:brandId
   */
  async getBrandByBrandId(
    params: GetBrandByBrandIdParams,
  ): Promise<GetBrandByBrandId200Response> {
    return await this.service.getBrandByBrandId(params);
  }

  /**
   * GET /v1/brands
   */
  async getBrands(query: GetBrandsQueryParams): Promise<GetBrands200Response> {
    return await this.service.getBrands(query);
  }

  /**
   * PATCH /v1/brands/:brandId
   */
  async patchBrand(
    params: PatchBrandParams,

    body: PatchBrandBody,
  ): Promise<void> {
    await this.service.patchBrand(
      params,

      body,
    );
  }

  /**
   * POST /v1/brands
   */
  async postBrand(body: PostBrandBody): Promise<PostBrand201Response> {
    return await this.service.postBrand(body);
  }
}
