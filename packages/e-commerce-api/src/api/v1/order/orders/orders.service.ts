import { Injectable } from '@nestjs/common';
import type {
  DeleteOrderParams,
  GetOrderByIdParams,
  GetOrderById200Response,
  GetOrdersQueryParams,
  GetOrders200Response,
  PostOrderBody,
  PostOrder201Response,
} from '@e-commerce/api-validation/types/order';
import type { BaseOrdersControllerInterface } from '@generated-controller/order/orders/base-orders.controller.interface';
import { OrdersRepository } from '@/api/v1/order/orders/orders.repository';

@Injectable()
export class OrdersService implements BaseOrdersControllerInterface {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  /**
   * DELETE /api/v1/orders/:orderId
   * @param params - path parameters with orderId
   */
  async deleteOrder(params: DeleteOrderParams): Promise<void> {
    await this.ordersRepository.deleteOrder(params.orderId);
  }

  /**
   * GET /api/v1/orders/:orderId
   * @param params - path parameters with orderId
   * @returns order details
   */
  async getOrderById(
    params: GetOrderByIdParams,
  ): Promise<GetOrderById200Response> {
    return await this.ordersRepository.getOrderById(params.orderId);
  }

  /**
   * GET /api/v1/orders
   * @param query - query parameters
   * @returns list of orders
   */
  async getOrders(query: GetOrdersQueryParams): Promise<GetOrders200Response> {
    return await this.ordersRepository.getOrders(query);
  }

  /**
   * POST /api/v1/orders
   * @param body - order creation data
   * @returns created order id
   */
  async postOrder(body: PostOrderBody): Promise<PostOrder201Response> {
    const orderId = await this.ordersRepository.createOrder(body);
    return { orderId };
  }
}
