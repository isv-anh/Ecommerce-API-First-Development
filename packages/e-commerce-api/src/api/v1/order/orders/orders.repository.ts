import { PrismaService } from '@/common/services/prisma.service';
import { parseSort } from '@/utils/parse-sort';
import {
  GetOrders200Response,
  GetOrdersQueryParams,
  GetOrderById200Response,
  PostOrderBody,
} from '@e-commerce/api-validation/types/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete an order by id
   * @param orderId - the order id
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.prisma.orders.delete({
        where: { id: orderId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of orders with optional filters by userId and status, with pagination
   * @param query - query parameters
   * @returns list of orders with pagination metadata
   */
  async getOrders(query: GetOrdersQueryParams): Promise<GetOrders200Response> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const whereClause: Prisma.ordersWhereInput = {
      ...(query.userId && { user_id: query.userId }),
      ...(query.status && { status: query.status }),
    };

    const sort = parseSort(query.orderBy);

    const [result, totalCount] = await Promise.all([
      this.prisma.orders.findMany({
        where: whereClause,
        orderBy: sort.length > 0 ? sort : [{ created_at: 'desc' }],
        take: pageSize,
        skip,
      }),
      this.prisma.orders.count({ where: whereClause }),
    ]);

    const orders = result.map((o) => ({
      orderId: o.id,
      userId: o.user_id,
      status: o.status ?? '',
      totalAmount: Number(o.total_amount ?? 0),
      totalDiscount: Number(o.total_discount ?? 0),
      finalAmount: Number(o.final_amount ?? 0),
      createdAt: o.created_at?.toISOString() ?? '',
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      orders,
      totalCount,
      totalPages,
    };
  }

  /**
   * Get a single order by id
   * @param orderId - the order id
   * @returns order details
   */
  async getOrderById(orderId: string): Promise<GetOrderById200Response> {
    const o = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!o) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: o.id,
      userId: o.user_id,
      status: o.status ?? '',
      totalAmount: Number(o.total_amount ?? 0),
      totalDiscount: Number(o.total_discount ?? 0),
      finalAmount: Number(o.final_amount ?? 0),
      createdAt: o.created_at?.toISOString() ?? '',
    };
  }

  /**
   * Create a new order
   * @param data - order creation data
   * @returns the new order id
   */
  async createOrder(data: PostOrderBody): Promise<string> {
    const orderId = crypto.randomUUID();
    await this.prisma.orders.create({
      data: {
        id: orderId,
        user_id: data.userId,
        status: 'PENDING', // Default status
        total_amount: 0,
        total_discount: 0,
        final_amount: 0,
        created_at: new Date(),
      },
    });
    return orderId;
  }
}
