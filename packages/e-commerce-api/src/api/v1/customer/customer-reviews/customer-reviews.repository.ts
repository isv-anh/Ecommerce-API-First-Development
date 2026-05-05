import { PrismaService } from '@/common/services/prisma.service';
import {
  GetReviews200Response,
  GetReviewsQueryParams,
  GetReviewById200Response,
  PatchReviewBody,
  PostReviewBody,
} from '@e-commerce/api-validation/types/customer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CustomerReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteReview(reviewId: string): Promise<void> {
    try {
      await this.prisma.reviews.delete({
        where: { id: reviewId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Review not found');
      }
      throw error;
    }
  }

  async getReviews(
    query: GetReviewsQueryParams,
  ): Promise<GetReviews200Response> {
    const whereClause = {
      product_id: query.productId,
    };

    const reviewsResult = await this.prisma.reviews.findMany({
      where: whereClause,
    });

    const reviews = reviewsResult.map((review) => ({
      reviewId: review.id,
      userId: review.user_id,
      productId: review.product_id,
      rating: review.rating || 0,
      comment: review.comment || undefined,
    }));

    return {
      reviews,
    };
  }

  async getReviewById(reviewId: string): Promise<GetReviewById200Response> {
    const review = await this.prisma.reviews.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return {
      reviewId: review.id,
      userId: review.user_id,
      productId: review.product_id,
      rating: review.rating || 0,
      comment: review.comment || undefined,
    };
  }

  async updateReview(reviewId: string, data: PatchReviewBody): Promise<void> {
    await this.prisma.reviews.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async createReview(data: PostReviewBody): Promise<string> {
    const reviewId = crypto.randomUUID();

    await this.prisma.reviews.create({
      data: {
        id: reviewId,
        user_id: data.userId,
        product_id: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
    });
    return reviewId;
  }
}
