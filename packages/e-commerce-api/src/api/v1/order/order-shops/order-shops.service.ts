import { Injectable } from '@nestjs/common';
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
import type { BaseOrderShopsControllerInterface } from '@generated-controller/order/order-shops/base-order-shops.controller.interface';
import { OrderShopsRepository } from '@/api/v1/order/order-shops/order-shops.repository';

@Injectable()
export class OrderShopsService implements BaseOrderShopsControllerInterface {
  constructor(private readonly orderShopsRepository: OrderShopsRepository) {}

  /**
   * DELETE /api/v1/orders/:orderId/shops/:orderShopId
   * @param params - path parameters
   */
  async deleteOrderShop(params: DeleteOrderShopParams): Promise<void> {
    await this.orderShopsRepository.deleteOrderShop(params.orderShopId);
  }

  /**
   * GET /api/v1/orders/:orderId/shops/:orderShopId
   * @param params - path parameters
   * @returns order shop details
   */
  async getOrderShopById(
    params: GetOrderShopByIdParams,
  ): Promise<GetOrderShopById200Response> {
    return await this.orderShopsRepository.getOrderShopById(params.orderShopId);
  }

  /**
   * GET /api/v1/orders/:orderId/shops
   * @param params - path parameters
   * @returns list of order shops
   */
  async getOrderShops(
    params: GetOrderShopsParams,
  ): Promise<GetOrderShops200Response> {
    return await this.orderShopsRepository.getOrderShops(params.orderId);
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
    await this.orderShopsRepository.updateOrderShop(params.orderShopId, body);
  }

  /**
   * POST /api/v1/orders/:orderId/shops
   * @param params - path parameters
   * @param body - order shop creation data
   * @returns created order shop id
   */
  async postOrderShop(
    params: PostOrderShopParams,
    body: PostOrderShopBody,
  ): Promise<PostOrderShop201Response> {
    const orderShopId = await this.orderShopsRepository.createOrderShop(
      params.orderId,
      body,
    );
    return { orderShopId };
  }
}
