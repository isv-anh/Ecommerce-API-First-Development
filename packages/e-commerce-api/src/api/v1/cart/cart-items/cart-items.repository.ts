import { PrismaService } from '@/common/services/prisma.service';
import {
  GetCartItems200Response,
  PatchCartItemBody,
  PostCartItemBody,
} from '@e-commerce/api-validation/types/cart';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CartItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteCartItem(
    cartId: string,
    productVariantId: string,
  ): Promise<void> {
    try {
      await this.prisma.cart_items.delete({
        where: {
          cart_id_product_variant_id: {
            cart_id: cartId,
            product_variant_id: productVariantId,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart Item not found');
      }
      throw error;
    }
  }

  async getCartItems(cartId: string): Promise<GetCartItems200Response> {
    const itemsResult = await this.prisma.cart_items.findMany({
      where: { cart_id: cartId },
    });

    const cartItems = itemsResult.map((item) => ({
      cartId: item.cart_id,
      productVariantId: item.product_variant_id,
      quantity: item.quantity || 0,
    }));

    return {
      cartItems,
    };
  }

  async updateCartItem(
    cartId: string,
    productVariantId: string,
    data: PatchCartItemBody,
  ): Promise<void> {
    await this.prisma.cart_items.update({
      where: {
        cart_id_product_variant_id: {
          cart_id: cartId,
          product_variant_id: productVariantId,
        },
      },
      data: {
        quantity: data.quantity,
      },
    });
  }

  async createCartItem(
    cartId: string,
    data: PostCartItemBody,
  ): Promise<{ cartId: string; productVariantId: string }> {
    const existing = await this.prisma.cart_items.findUnique({
      where: {
        cart_id_product_variant_id: {
          cart_id: cartId,
          product_variant_id: data.productVariantId,
        },
      },
    });

    if (existing) {
      await this.prisma.cart_items.update({
        where: {
          cart_id_product_variant_id: {
            cart_id: cartId,
            product_variant_id: data.productVariantId,
          },
        },
        data: {
          quantity: (existing.quantity || 0) + (data.quantity || 1),
        },
      });
    } else {
      await this.prisma.cart_items.create({
        data: {
          cart_id: cartId,
          product_variant_id: data.productVariantId,
          quantity: data.quantity || 1,
        },
      });
    }

    return {
      cartId: cartId,
      productVariantId: data.productVariantId,
    };
  }
}
