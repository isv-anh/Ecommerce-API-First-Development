import { PrismaService } from '@/common/services/prisma.service';
import {
  GetOrderItems200Response,
  GetOrderItemById200Response,
  PatchOrderItemBody,
  PostOrderItemBody,
} from '@e-commerce/api-validation/types/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type { products } from 'generated/prisma/client';

type CatalogThumbnail = Pick<products, 'id' | 'thumbnail_url'>;

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

    const thumbnails = await this.getThumbnails(result);
    const orderItems = result.map((item) => ({
      orderItemId: item.id,
      orderId: item.order_id,
      productId: item.product_id ?? '',
      productVariantId: item.product_variant_id ?? '',
      productName: item.product_name ?? '',
      variantName: item.variant_name ?? '',
      thumbnailUrl: thumbnails.get(item.id) ?? null,
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

    const thumbnails = await this.getThumbnails([item]);
    return {
      orderItemId: item.id,
      orderId: item.order_id,
      productId: item.product_id ?? '',
      productVariantId: item.product_variant_id ?? '',
      productName: item.product_name ?? '',
      variantName: item.variant_name ?? '',
      thumbnailUrl: thumbnails.get(item.id) ?? null,
      price: Number(item.price ?? 0),
      quantity: item.quantity ?? 0,
      totalPrice: Number(item.total_price ?? 0),
    };
  }

  /** Resolve current images in batches while retaining historical order item data. */
  private async getThumbnails(
    items: {
      id: string;
      product_id: string | null;
      product_variant_id: string | null;
    }[],
  ): Promise<Map<string, string | null>> {
    const productIds = [
      ...new Set(
        items.flatMap((item) => (item.product_id ? [item.product_id] : [])),
      ),
    ];
    const variantIds = [
      ...new Set(
        items.flatMap((item) =>
          item.product_variant_id ? [item.product_variant_id] : [],
        ),
      ),
    ];
    const [products, variants]: [CatalogThumbnail[], CatalogThumbnail[]] =
      await Promise.all([
        productIds.length
          ? this.prisma.products.findMany({
              where: { id: { in: productIds } },
              select: { id: true, thumbnail_url: true },
            })
          : [],
        variantIds.length
          ? this.prisma.product_variants.findMany({
              where: { id: { in: variantIds } },
              select: { id: true, thumbnail_url: true },
            })
          : [],
      ]);
    const productImages = new Map(
      products.map((product) => [product.id, product.thumbnail_url]),
    );
    const variantImages = new Map(
      variants.map((variant) => [variant.id, variant.thumbnail_url]),
    );
    return new Map(
      items.map((item) => [
        item.id,
        (item.product_variant_id &&
          variantImages.get(item.product_variant_id)) ||
          (item.product_id && productImages.get(item.product_id)) ||
          null,
      ]),
    );
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
