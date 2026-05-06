import { PrismaService } from '@/common/services/prisma.service';
import {
  GetOrderShops200Response,
  GetOrderShopById200Response,
  PatchOrderShopBody,
  PostOrderShopBody,
} from '@e-commerce/api-validation/types/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class OrderShopsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete an order shop by id
   * @param orderShopId - the order shop id
   */
  async deleteOrderShop(orderShopId: string): Promise<void> {
    try {
      await this.prisma.order_shops.delete({
        where: { id: orderShopId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order Shop not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of order shops for a specific order
   * @param orderId - the order id
   * @returns list of order shops
   */
  async getOrderShops(orderId: string): Promise<GetOrderShops200Response> {
    const result = await this.prisma.order_shops.findMany({
      where: {
        order_id: orderId,
      },
    });

    const orderShops = result.map((os) => ({
      orderShopId: os.id,
      orderId: os.order_id,
      shopId: os.shop_id,
      subtotal: Number(os.subtotal ?? 0),
      discount: Number(os.discount ?? 0),
      finalAmount: Number(os.final_amount ?? 0),
      status: os.status ?? '',
    }));

    return { orderShops };
  }

  /**
   * Get a single order shop by id
   * @param orderShopId - the order shop id
   * @returns order shop details
   */
  async getOrderShopById(
    orderShopId: string,
  ): Promise<GetOrderShopById200Response> {
    const os = await this.prisma.order_shops.findUnique({
      where: { id: orderShopId },
    });

    if (!os) {
      throw new NotFoundException('Order Shop not found');
    }

    return {
      orderShopId: os.id,
      orderId: os.order_id,
      shopId: os.shop_id,
      subtotal: Number(os.subtotal ?? 0),
      discount: Number(os.discount ?? 0),
      finalAmount: Number(os.final_amount ?? 0),
      status: os.status ?? '',
    };
  }

  /**
   * Update an order shop by id
   * @param orderShopId - the order shop id
   * @param data - partial update data
   */
  async updateOrderShop(
    orderShopId: string,
    data: PatchOrderShopBody,
  ): Promise<void> {
    await this.prisma.order_shops.update({
      where: { id: orderShopId },
      data: {
        subtotal: data.subtotal,
        discount: data.discount,
        final_amount: data.finalAmount,
        status: data.status,
      },
    });
  }

  /**
   * Create a new order shop
   * @param orderId - the order id
   * @param data - order shop creation data
   * @returns the new order shop id
   */
  async createOrderShop(
    orderId: string,
    data: PostOrderShopBody,
  ): Promise<string> {
    const orderShopId = crypto.randomUUID();
    await this.prisma.order_shops.create({
      data: {
        id: orderShopId,
        order_id: orderId,
        shop_id: data.shopId,
        subtotal: data.subtotal ?? 0,
        discount: data.discount ?? 0,
        final_amount: data.finalAmount ?? 0,
        status: data.status ?? 'PENDING',
      },
    });
    return orderShopId;
  }
}
