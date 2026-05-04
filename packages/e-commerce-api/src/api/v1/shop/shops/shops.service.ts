import { Injectable } from '@nestjs/common';
import type {
  DeleteShopParams,
  GetShopsQueryParams,
  GetShops200Response,
  GetShopByIdParams,
  GetShopById200Response,
  PatchShopParams,
  PatchShopBody,
  PostShopBody,
  PostShop201Response,
  GetShopMe200Response,
} from '@e-commerce/api-validation/types/shop';
import type { BaseShopsControllerInterface } from '@generated-controller/shop/shops/base-shops.controller.interface';
import { ShopsRepository } from '@/api/v1/shop/shops/shops.repository';

@Injectable()
export class ShopsService implements BaseShopsControllerInterface {
  constructor(private readonly shopsRepository: ShopsRepository) {}

  /**
   * DELETE /v1/shops/:shopId
   *
   * @param params - Path parameters typed as {@link DeleteShopParams}
   * @returns void
   */
  async deleteShop(params: DeleteShopParams): Promise<void> {
    await this.shopsRepository.deleteShop(params.shopId);
  }

  /**
   * GET /api/v1/shops/me
   *
   * @returns {@link GetShopMe200Response}
   */
  // TODO: Implement getShopMe to return the shop information of the currently authenticated user
  // eslint-disable-next-line @typescript-eslint/require-await
  async getShopMe(): Promise<GetShopMe200Response> {
    throw new Error('Not implemented');
  }

  /**
   * GET /v1/shops
   *
   * @param query - Query parameters typed as {@link GetShopsQueryParams}
   * @returns {@link GetShops200Response}
   */
  async getShops(query: GetShopsQueryParams): Promise<GetShops200Response> {
    return await this.shopsRepository.getShops(query);
  }

  /**
   * GET /v1/shops/:shopId
   *
   * @param params - Path parameters typed as {@link GetShopByIdParams}
   * @returns {@link GetShopById200Response}
   */
  async getShopById(
    params: GetShopByIdParams,
  ): Promise<GetShopById200Response> {
    return await this.shopsRepository.getShopById(params.shopId);
  }

  /**
   * PATCH /v1/shops/:shopId
   *
   * @param params - Path parameters typed as {@link PatchShopParams}
   * @param body - Request body typed as {@link PatchShopBody}
   * @returns void
   */
  async patchShop(
    params: PatchShopParams,

    body: PatchShopBody,
  ): Promise<void> {
    await this.shopsRepository.updateShop(params.shopId, body);
  }

  /**
   * POST /v1/shops
   *
   * @param body - Request body typed as {@link PostShopBody}
   * @returns {@link PostShop201Response}
   */
  async postShop(body: PostShopBody): Promise<PostShop201Response> {
    const shopId = await this.shopsRepository.createShop(body);
    return { shopId };
  }
}
