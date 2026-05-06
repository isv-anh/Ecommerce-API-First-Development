import { Injectable } from '@nestjs/common';
import type {
  DeleteOrderItemParams,
  GetOrderItemByIdParams,
  GetOrderItemById200Response,
  GetOrderItemsParams,
  GetOrderItems200Response,
  PatchOrderItemParams,
  PatchOrderItemBody,
  PostOrderItemParams,
  PostOrderItemBody,
  PostOrderItem201Response,
} from '@e-commerce/api-validation/types/order';
import type { BaseOrderItemsControllerInterface } from '@generated-controller/order/order-items/base-order-items.controller.interface';
import { OrderItemsRepository } from '@/api/v1/order/order-items/order-items.repository';

@Injectable()
export class OrderItemsService implements BaseOrderItemsControllerInterface {
  constructor(private readonly orderItemsRepository: OrderItemsRepository) {}

  /**
   * DELETE /api/v1/orders/:orderId/items/:orderItemId
   * @param params - path parameters
   */
  async deleteOrderItem(params: DeleteOrderItemParams): Promise<void> {
    await this.orderItemsRepository.deleteOrderItem(params.orderItemId);
  }

  /**
   * GET /api/v1/orders/:orderId/items/:orderItemId
   * @param params - path parameters
   * @returns order item details
   */
  async getOrderItemById(
    params: GetOrderItemByIdParams,
  ): Promise<GetOrderItemById200Response> {
    return await this.orderItemsRepository.getOrderItemById(params.orderItemId);
  }

  /**
   * GET /api/v1/orders/:orderId/items
   * @param params - path parameters with orderId
   * @returns list of order items
   */
  async getOrderItems(
    params: GetOrderItemsParams,
  ): Promise<GetOrderItems200Response> {
    return await this.orderItemsRepository.getOrderItems(params.orderId);
  }

  /**
   * PATCH /api/v1/orders/:orderId/items/:orderItemId
   * @param params - path parameters
   * @param body - partial update data
   */
  async patchOrderItem(
    params: PatchOrderItemParams,
    body: PatchOrderItemBody,
  ): Promise<void> {
    await this.orderItemsRepository.updateOrderItem(params.orderItemId, body);
  }

  /**
   * POST /api/v1/orders/:orderId/items
   * @param params - path parameters with orderId
   * @param body - order item creation data
   * @returns created order item id
   */
  async postOrderItem(
    params: PostOrderItemParams,
    body: PostOrderItemBody,
  ): Promise<PostOrderItem201Response> {
    const orderItemId = await this.orderItemsRepository.createOrderItem(
      params.orderId,
      body,
    );
    return { orderItemId };
  }
}
