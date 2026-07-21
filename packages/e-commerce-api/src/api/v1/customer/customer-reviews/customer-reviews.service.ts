import { Injectable } from '@nestjs/common';
import type {
  DeleteReviewParams,
  GetReviewsQueryParams,
  GetReviews200Response,
  GetReviewByIdParams,
  GetReviewById200Response,
  PatchReviewParams,
  PatchReviewBody,
  PostReviewBody,
  PostReview201Response,
} from '@e-commerce/api-validation/types/customer';

import { CustomerReviewsRepository } from '@/api/v1/customer/customer-reviews/customer-reviews.repository';
import { BaseCustomerReviewsControllerInterface } from '@generated-controller/customer/customer-reviews/base-customer-reviews.controller.interface';

@Injectable()
export class CustomerReviewsService implements BaseCustomerReviewsControllerInterface {
  constructor(
    private readonly customerReviewsRepository: CustomerReviewsRepository,
  ) {}

  /**
   * DELETE /v1/reviews/:reviewId
   *
   * @param params - Path parameters typed as {@link DeleteReviewParams}
   * @returns void
   */
  async deleteReview(params: DeleteReviewParams): Promise<void> {
    await this.customerReviewsRepository.deleteReview(params.reviewId);
  }

  /**
   * GET /v1/reviews
   *
   * @param query - Query parameters typed as {@link GetReviewsQueryParams}
   * @returns {@link GetReviews200Response}
   */
  async getReviews(
    query: GetReviewsQueryParams,
  ): Promise<GetReviews200Response> {
    return await this.customerReviewsRepository.getReviews(query);
  }

  /**
   * GET /v1/reviews/:reviewId
   *
   * @param params - Path parameters typed as {@link GetReviewByIdParams}
   * @returns {@link GetReviewById200Response}
   */
  async getReviewById(
    params: GetReviewByIdParams,
  ): Promise<GetReviewById200Response> {
    return await this.customerReviewsRepository.getReviewById(params.reviewId);
  }

  /**
   * PATCH /v1/reviews/:reviewId
   *
   * @param params - Path parameters typed as {@link PatchReviewParams}
   * @param body - Request body typed as {@link PatchReviewBody}
   * @returns void
   */
  async patchReview(
    params: PatchReviewParams,

    body: PatchReviewBody,
  ): Promise<void> {
    await this.customerReviewsRepository.updateReview(params.reviewId, body);
  }

  /**
   * POST /v1/reviews
   *
   * @param body - Request body typed as {@link PostReviewBody}
   * @returns {@link PostReview201Response}
   */
  async postReview(body: PostReviewBody): Promise<PostReview201Response> {
    const reviewId = await this.customerReviewsRepository.createReview(body);
    return { reviewId };
  }
}
