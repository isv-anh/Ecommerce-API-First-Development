import { PrismaService } from '@/common/services/prisma.service';
import {
  GetWishlistItems200Response,
  PostWishlistItemBody,
} from '@e-commerce/api-validation/types/customer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CustomerWishlistItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteWishlistItem(
    wishlistId: string,
    wishlistItemId: string,
  ): Promise<void> {
    try {
      await this.prisma.wishlist_items.delete({
        where: { id: wishlistItemId, wishlist_id: wishlistId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Wishlist Item not found');
      }
      throw error;
    }
  }

  async getWishlistItems(
    wishlistId: string,
  ): Promise<GetWishlistItems200Response> {
    const itemsResult = await this.prisma.wishlist_items.findMany({
      where: { wishlist_id: wishlistId },
    });

    const wishlistItems = itemsResult.map((item) => ({
      wishlistItemId: item.id,
      wishlistId: item.wishlist_id,
      productId: item.product_id,
    }));

    return {
      wishlistItems,
    };
  }

  async createWishlistItem(
    wishlistId: string,
    data: PostWishlistItemBody,
  ): Promise<string> {
    const wishlistItemId = crypto.randomUUID();

    await this.prisma.wishlist_items.create({
      data: {
        id: wishlistItemId,
        wishlist_id: wishlistId,
        product_id: data.productId,
      },
    });
    return wishlistItemId;
  }
}
