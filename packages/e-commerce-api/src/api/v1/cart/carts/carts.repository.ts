import { PrismaService } from '@/common/services/prisma.service';
import {
  GetCart200Response,
  PostCartBody,
} from '@e-commerce/api-validation/types/cart';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CartsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteCart(cartId: string): Promise<void> {
    try {
      await this.prisma.carts.delete({
        where: { id: cartId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart not found');
      }
      throw error;
    }
  }

  async getCartByUserId(userId: string): Promise<GetCart200Response> {
    const cart = await this.prisma.carts.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return {
      cartId: cart.id,
      userId: cart.user_id,
      updatedAt: cart.updated_at?.toISOString() || '',
    };
  }

  async createCart(data: PostCartBody): Promise<string> {
    const existing = await this.prisma.carts.findUnique({
      where: { user_id: data.userId },
    });
    if (existing) {
      throw new ConflictException('User already has a cart');
    }

    const cartId = crypto.randomUUID();
    await this.prisma.carts.create({
      data: {
        id: cartId,
        user_id: data.userId,
      },
    });
    return cartId;
  }
}
