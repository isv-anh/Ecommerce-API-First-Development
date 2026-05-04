import { Injectable } from '@nestjs/common';
import { ShopsService } from './shops.service';
import type {
  DeleteShopParams,
  GetShopByIdParams,
  GetShopById200Response,
  GetShopMe200Response,
  GetShopsQueryParams,
  GetShops200Response,
  PatchShopParams,
  PatchShopBody,
  PostShopBody,
  PostShop201Response,
} from '@e-commerce/api-validation/types/shop';
import { BaseShopsControllerInterface } from '@generated-controller/shop/shops/base-shops.controller.interface';

@Injectable()
export class ShopsController implements BaseShopsControllerInterface {
  constructor(private readonly service: ShopsService) {}

  /**
   * DELETE /api/v1/shops/:shopId
   */
  async deleteShop(params: DeleteShopParams): Promise<void> {
    await this.service.deleteShop(params);
  }

  /**
   * GET /api/v1/shops/:shopId
   */
  async getShopById(
    params: GetShopByIdParams,
  ): Promise<GetShopById200Response> {
    return await this.service.getShopById(params);
  }

  /**
   * GET /api/v1/shops/me
   */
  async getShopMe(): Promise<GetShopMe200Response> {
    return await this.service.getShopMe();
  }

  /**
   * GET /api/v1/shops
   */
  async getShops(query: GetShopsQueryParams): Promise<GetShops200Response> {
    return await this.service.getShops(query);
  }

  /**
   * PATCH /api/v1/shops/:shopId
   */
  async patchShop(
    params: PatchShopParams,

    body: PatchShopBody,
  ): Promise<void> {
    await this.service.patchShop(
      params,

      body,
    );
  }

  /**
   * POST /api/v1/shops
   */
  async postShop(body: PostShopBody): Promise<PostShop201Response> {
    return await this.service.postShop(body);
  }
}
