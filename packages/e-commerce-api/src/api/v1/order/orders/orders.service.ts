import { Inject, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
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

interface OrderServiceClient {
  createOrder(data: any): Observable<any>;
  getOrders(data: any): Observable<any>;
  getOrderById(data: any): Observable<any>;
  deleteOrder(data: any): Observable<any>;
}

@Injectable()
export class OrdersService implements BaseOrdersControllerInterface, OnModuleInit {
  private orderServiceClient: OrderServiceClient;

  constructor(@Inject('ORDER_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderServiceClient = this.client.getService<OrderServiceClient>('OrderService');
  }

  /**
   * DELETE /api/v1/orders/:orderId
   */
  async deleteOrder(params: DeleteOrderParams): Promise<void> {
    const result = await firstValueFrom(this.orderServiceClient.deleteOrder({ order_id: params.orderId }));
    if (!result.success) {
      throw new NotFoundException('Order not found');
    }
  }

  /**
   * GET /api/v1/orders/:orderId
   */
  async getOrderById(
    params: GetOrderByIdParams,
  ): Promise<GetOrderById200Response> {
    const result = await firstValueFrom(this.orderServiceClient.getOrderById({ order_id: params.orderId }));
    if (!result.order) {
      throw new NotFoundException('Order not found');
    }
    const o = result.order;
    return {
      orderId: o.orderId,
      userId: o.userId,
      status: o.status,
      totalAmount: o.totalAmount,
      totalDiscount: o.totalDiscount,
      finalAmount: o.finalAmount,
      createdAt: o.createdAt,
    };
  }

  /**
   * GET /api/v1/orders
   */
  async getOrders(query: GetOrdersQueryParams): Promise<GetOrders200Response> {
    const result = await firstValueFrom(this.orderServiceClient.getOrders({
      user_id: query.userId,
      status: query.status,
      page: query.page,
      page_size: query.pageSize,
      order_by: query.orderBy,
    }));
    
    return {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      orders: (result.orders || []).map((o: any) => ({
        orderId: o.orderId,
        userId: o.userId,
        status: o.status,
        totalAmount: o.totalAmount,
        totalDiscount: o.totalDiscount,
        finalAmount: o.finalAmount,
        createdAt: o.createdAt,
      })),
    };
  }

  /**
   * POST /api/v1/orders
   */
  async postOrder(body: PostOrderBody): Promise<PostOrder201Response> {
    const result = await firstValueFrom(this.orderServiceClient.createOrder({ user_id: body.userId }));
    return { orderId: result.orderId };
  }
}
