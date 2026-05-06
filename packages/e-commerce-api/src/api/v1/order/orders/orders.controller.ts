import { Injectable } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type {
  DeleteOrderParams,
  GetOrderByIdParams,
  GetOrderById200Response,
  GetOrdersQueryParams,
  GetOrders200Response,
  PostOrderBody,
  PostOrder201Response,
} from '@e-commerce/api-validation/types/order';
import { BaseOrdersControllerInterface } from '@generated-controller/order/orders/base-orders.controller.interface';

@Injectable()
export class OrdersController implements BaseOrdersControllerInterface {
  constructor(private readonly service: OrdersService) {}

  /**
   * DELETE /api/v1/orders/:orderId
   * @param params - path parameters
   */
  async deleteOrder(params: DeleteOrderParams): Promise<void> {
    await this.service.deleteOrder(params);
  }

  /**
   * GET /api/v1/orders/:orderId
   * @param params - path parameters
   * @returns order details
   */
  async getOrderById(
    params: GetOrderByIdParams,
  ): Promise<GetOrderById200Response> {
    return await this.service.getOrderById(params);
  }

  /**
   * GET /api/v1/orders
   * @param query - query parameters
   * @returns list of orders
   */
  async getOrders(query: GetOrdersQueryParams): Promise<GetOrders200Response> {
    return await this.service.getOrders(query);
  }

  /**
   * POST /api/v1/orders
   * @param body - creation data
   * @returns created order id
   */
  async postOrder(body: PostOrderBody): Promise<PostOrder201Response> {
    return await this.service.postOrder(body);
  }
}
