import { Injectable } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
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
import { BaseOrderItemsControllerInterface } from '@generated-controller/order/order-items/base-order-items.controller.interface';

@Injectable()
export class OrderItemsController implements BaseOrderItemsControllerInterface {
  constructor(private readonly service: OrderItemsService) {}

  /**
   * DELETE /api/v1/orders/:orderId/items/:orderItemId
   * @param params - path parameters
   */
  async deleteOrderItem(params: DeleteOrderItemParams): Promise<void> {
    await this.service.deleteOrderItem(params);
  }

  /**
   * GET /api/v1/orders/:orderId/items/:orderItemId
   * @param params - path parameters
   * @returns order item details
   */
  async getOrderItemById(
    params: GetOrderItemByIdParams,
  ): Promise<GetOrderItemById200Response> {
    return await this.service.getOrderItemById(params);
  }

  /**
   * GET /api/v1/orders/:orderId/items
   * @param params - path parameters
   * @returns list of order items
   */
  async getOrderItems(
    params: GetOrderItemsParams,
  ): Promise<GetOrderItems200Response> {
    return await this.service.getOrderItems(params);
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
    await this.service.patchOrderItem(params, body);
  }

  /**
   * POST /api/v1/orders/:orderId/items
   * @param params - path parameters
   * @param body - creation data
   * @returns created order item id
   */
  async postOrderItem(
    params: PostOrderItemParams,
    body: PostOrderItemBody,
  ): Promise<PostOrderItem201Response> {
    return await this.service.postOrderItem(params, body);
  }
}
