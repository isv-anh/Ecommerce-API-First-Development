import { PrismaService } from '@/common/services/prisma.service';
import {
  GetOrderItems200Response,
  GetOrderItemById200Response,
  PatchOrderItemBody,
  PostOrderItemBody,
} from '@e-commerce/api-validation/types/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete an order item by id
   * @param orderItemId - the order item id
   */
  async deleteOrderItem(orderItemId: string): Promise<void> {
    try {
      await this.prisma.order_items.delete({
        where: { id: orderItemId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order Item not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of order items for a specific order
   * @param orderId - the order id
   * @returns list of order items
   */
  async getOrderItems(orderId: string): Promise<GetOrderItems200Response> {
    const result = await this.prisma.order_items.findMany({
      where: {
        order_id: orderId,
      },
    });

    const orderItems = result.map((item) => ({
      orderItemId: item.id,
      orderId: item.order_id,
      shopId: item.shop_id ?? '',
      productId: item.product_id ?? '',
      productVariantId: item.product_variant_id ?? '',
      productName: item.product_name ?? '',
      variantName: item.variant_name ?? '',
      price: Number(item.price ?? 0),
      quantity: item.quantity ?? 0,
      totalPrice: Number(item.total_price ?? 0),
    }));

    return { orderItems };
  }

  /**
   * Get a single order item by id
   * @param orderItemId - the order item id
   * @returns order item details
   */
  async getOrderItemById(
    orderItemId: string,
  ): Promise<GetOrderItemById200Response> {
    const item = await this.prisma.order_items.findUnique({
      where: { id: orderItemId },
    });

    if (!item) {
      throw new NotFoundException('Order Item not found');
    }

    return {
      orderItemId: item.id,
      orderId: item.order_id,
      shopId: item.shop_id ?? '',
      productId: item.product_id ?? '',
      productVariantId: item.product_variant_id ?? '',
      productName: item.product_name ?? '',
      variantName: item.variant_name ?? '',
      price: Number(item.price ?? 0),
      quantity: item.quantity ?? 0,
      totalPrice: Number(item.total_price ?? 0),
    };
  }

  /**
   * Update an order item by id
   * @param orderItemId - the order item id
   * @param data - partial update data
   */
  async updateOrderItem(
    orderItemId: string,
    data: PatchOrderItemBody,
  ): Promise<void> {
    const current = await this.prisma.order_items.findUnique({
      where: { id: orderItemId },
    });

    if (!current) {
      throw new NotFoundException('Order Item not found');
    }

    const price = Number(current.price ?? 0);
    const quantity = data.quantity ?? current.quantity ?? 0;
    const totalPrice = price * quantity;

    await this.prisma.order_items.update({
      where: { id: orderItemId },
      data: {
        quantity: data.quantity,
        total_price: totalPrice,
      },
    });
  }

  /**
   * Create a new order item
   * @param orderId - the order id
   * @param data - order item creation data
   * @returns the new order item id
   */
  async createOrderItem(
    orderId: string,
    data: PostOrderItemBody,
  ): Promise<string> {
    const orderItemId = crypto.randomUUID();
    const totalPrice = data.price * data.quantity;

    await this.prisma.order_items.create({
      data: {
        id: orderItemId,
        order_id: orderId,
        shop_id: data.shopId,
        product_id: data.productId,
        product_variant_id: data.productVariantId,
        product_name: data.productName,
        variant_name: data.variantName,
        price: data.price,
        quantity: data.quantity,
        total_price: totalPrice,
      },
    });
    return orderItemId;
  }
}
