import { Injectable } from '@nestjs/common';
import { OrderShopsService } from './order-shops.service';
import type {
  DeleteOrderShopParams,
  GetOrderShopByIdParams,
  GetOrderShopById200Response,
  GetOrderShopsParams,
  GetOrderShops200Response,
  PatchOrderShopParams,
  PatchOrderShopBody,
  PostOrderShopParams,
  PostOrderShopBody,
  PostOrderShop201Response,
} from '@e-commerce/api-validation/types/order';
import { BaseOrderShopsControllerInterface } from '@generated-controller/order/order-shops/base-order-shops.controller.interface';

@Injectable()
export class OrderShopsController implements BaseOrderShopsControllerInterface {
  constructor(private readonly service: OrderShopsService) {}

  /**
   * DELETE /api/v1/orders/:orderId/shops/:orderShopId
   * @param params - path parameters
   */
  async deleteOrderShop(params: DeleteOrderShopParams): Promise<void> {
    await this.service.deleteOrderShop(params);
  }

  /**
   * GET /api/v1/orders/:orderId/shops/:orderShopId
   * @param params - path parameters
   * @returns order shop details
   */
  async getOrderShopById(
    params: GetOrderShopByIdParams,
  ): Promise<GetOrderShopById200Response> {
    return await this.service.getOrderShopById(params);
  }

  /**
   * GET /api/v1/orders/:orderId/shops
   * @param params - path parameters
   * @returns list of order shops
   */
  async getOrderShops(
    params: GetOrderShopsParams,
  ): Promise<GetOrderShops200Response> {
    return await this.service.getOrderShops(params);
  }

  /**
   * PATCH /api/v1/orders/:orderId/shops/:orderShopId
   * @param params - path parameters
   * @param body - partial update data
   */
  async patchOrderShop(
    params: PatchOrderShopParams,
    body: PatchOrderShopBody,
  ): Promise<void> {
    await this.service.patchOrderShop(params, body);
  }

  /**
   * POST /api/v1/orders/:orderId/shops
   * @param params - path parameters
   * @param body - creation data
   * @returns created order shop id
   */
  async postOrderShop(
    params: PostOrderShopParams,
    body: PostOrderShopBody,
  ): Promise<PostOrderShop201Response> {
    return await this.service.postOrderShop(params, body);
  }
}
