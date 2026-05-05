import { PrismaService } from '@/common/services/prisma.service';
import {
  GetWishlists200Response,
  GetWishlistsQueryParams,
  GetWishlistById200Response,
  PostWishlistBody,
} from '@e-commerce/api-validation/types/customer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CustomerWishlistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteWishlist(wishlistId: string): Promise<void> {
    try {
      await this.prisma.wishlists.delete({
        where: { id: wishlistId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Wishlist not found');
      }
      throw error;
    }
  }

  async getWishlists(
    query: GetWishlistsQueryParams,
  ): Promise<GetWishlists200Response> {
    const whereClause = {
      user_id: query.userId,
    };

    const wishlistsResult = await this.prisma.wishlists.findMany({
      where: whereClause,
    });

    const wishlists = wishlistsResult.map((wishlist) => ({
      wishlistId: wishlist.id,
      userId: wishlist.user_id,
    }));

    return {
      wishlists,
    };
  }

  async getWishlistById(
    wishlistId: string,
  ): Promise<GetWishlistById200Response> {
    const wishlist = await this.prisma.wishlists.findUnique({
      where: { id: wishlistId },
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return {
      wishlistId: wishlist.id,
      userId: wishlist.user_id,
    };
  }

  async createWishlist(data: PostWishlistBody): Promise<string> {
    const wishlistId = crypto.randomUUID();

    await this.prisma.wishlists.create({
      data: {
        id: wishlistId,
        user_id: data.userId,
      },
    });
    return wishlistId;
  }
}
