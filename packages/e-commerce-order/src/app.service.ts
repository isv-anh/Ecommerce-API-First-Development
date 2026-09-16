import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma.service.js';
import { parseSort } from './utils/parse-sort.js';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // --- API Gateway methods ---

  async createOrder(data: any): Promise<any> {
    const orderId = randomUUID();
    await this.prisma.orders.create({
      data: {
        id: orderId,
        user_id: data.userId,
        status: 'PENDING',
        total_amount: 0,
        total_discount: 0,
        final_amount: 0,
        created_at: new Date(),
      },
    });
    return { orderId };
  }

  async getOrders(query: any): Promise<any> {
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

  async getOrderById(data: any): Promise<any> {
    const o = await this.prisma.orders.findUnique({
      where: { id: data.orderId },
    });

    if (!o) {
      return { order: null }; // Returning null to indicate not found in gRPC
    }

    return {
      order: {
        orderId: o.id,
        userId: o.user_id,
        status: o.status ?? '',
        totalAmount: Number(o.total_amount ?? 0),
        totalDiscount: Number(o.total_discount ?? 0),
        finalAmount: Number(o.final_amount ?? 0),
        createdAt: o.created_at?.toISOString() ?? '',
      },
    };
  }

  async deleteOrder(data: any): Promise<any> {
    try {
      await this.prisma.orders.delete({
        where: { id: data.orderId },
      });
      return { success: true };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return { success: false }; // Not found
      }
      throw error;
    }
  }

  // --- AI Assistant methods ---

  async placeOrder(data: any): Promise<any> {
    const orderId = randomUUID();
    const totalAmount = data.items?.reduce((sum: number, item: any) => sum + (item.quantity * 10), 0) || 0;
    
    await this.prisma.orders.create({
      data: {
        id: orderId,
        user_id: data.customerId,
        status: 'CREATED',
        total_amount: totalAmount,
        final_amount: totalAmount,
        created_at: new Date(),
      },
    });
    
    return {
      orderId,
      status: 'CREATED',
      message: 'Order created successfully'
    };
  }

  async getOrder(data: any): Promise<any> {
    const order = await this.prisma.orders.findUnique({
      where: { id: data.orderId },
    });
    
    if (!order) {
      return {
        orderId: data.orderId,
        status: 'NOT_FOUND',
        message: 'Order not found'
      };
    }
    
    return {
      orderId: order.id,
      customerId: order.user_id,
      items: [], // Simplified for now
      status: order.status || '',
      totalAmount: Number(order.total_amount || 0)
    };
  }

  async cancelOrder(data: any): Promise<any> {
    try {
      await this.prisma.orders.update({
        where: { id: data.orderId },
        data: { status: 'CANCELLED' }
      });
      return {
        success: true,
        message: `Order cancelled due to: ${data.reason}`
      };
    } catch (e) {
      return {
        success: false,
        message: 'Order not found or could not be cancelled'
      };
    }
  }
}
