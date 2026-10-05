import {
  Inject,
  Injectable,
  OnModuleInit,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import type {
  CancelOrderParams,
  DeleteOrderParams,
  GetOrderByIdParams,
  GetOrderById200Response,
  GetOrdersQueryParams,
  GetOrders200Response,
  PostOrderBody,
  PostOrder201Response,
} from '@e-commerce/api-validation/types/order';
import type { BaseOrdersControllerInterface } from '@generated-controller/order/orders/base-orders.controller.interface';
import { ClsService } from '@/common/services/cls/cls.service';

interface OrderServiceClient {
  createOrder(data: any): Observable<any>;
  getOrders(data: any): Observable<any>;
  getOrderById(data: any): Observable<any>;
  deleteOrder(data: any): Observable<any>;
  cancelOrder(data: any): Observable<any>;
}

@Injectable()
export class OrdersService
  implements BaseOrdersControllerInterface, OnModuleInit
{
  private orderServiceClient: OrderServiceClient;

  constructor(
    @Inject('ORDER_SERVICE') private readonly client: ClientGrpc,
    private readonly clsService: ClsService,
  ) {}

  onModuleInit() {
    this.orderServiceClient =
      this.client.getService<OrderServiceClient>('OrderService');
  }

  /** Cancel an eligible order owned by the authenticated customer. */
  async cancelOrder(params: CancelOrderParams): Promise<void> {
    const userId = this.clsService.userId;
    if (!userId) throw new UnauthorizedException();

    const { order } = await firstValueFrom(
      this.orderServiceClient.getOrderById({ orderId: params.orderId }),
    );
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
    if (order.userId !== userId) throw new ForbiddenException();
    if (!['PENDING', 'CONFIRMED'].includes(order.status.toUpperCase())) {
      throw new BadRequestException('Đơn hàng này không thể hủy.');
    }

    const result = await firstValueFrom(
      this.orderServiceClient.cancelOrder({
        orderId: params.orderId,
        reason: 'Khách hàng yêu cầu hủy đơn hàng',
      }),
    );
    if (!result.success) {
      throw new BadRequestException(
        'Không thể hủy đơn hàng. Vui lòng tải lại và thử lại.',
      );
    }
  }

  /**
   * DELETE /api/v1/orders/:orderId
   */
  async deleteOrder(params: DeleteOrderParams): Promise<void> {
    const result = await firstValueFrom(
      this.orderServiceClient.deleteOrder({ order_id: params.orderId }),
    );
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
    const result = await firstValueFrom(
      this.orderServiceClient.getOrderById({ order_id: params.orderId }),
    );
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
    const result = await firstValueFrom(
      this.orderServiceClient.getOrders({
        user_id: query.userId,
        status: query.status,
        page: query.page,
        page_size: query.pageSize,
        order_by: query.orderBy,
      }),
    );

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
    const result = await firstValueFrom(
      this.orderServiceClient.createOrder({ user_id: body.userId }),
    );
    return { orderId: result.orderId };
  }
}
