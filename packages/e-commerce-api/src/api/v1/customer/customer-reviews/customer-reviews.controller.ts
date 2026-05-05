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
import { BaseCustomerReviewsControllerInterface } from '@generated-controller/customer/customer-reviews/base-customer-reviews.controller.interface';
import { CustomerReviewsService } from '@/api/v1/customer/customer-reviews/customer-reviews.service';

@Injectable()
export class CustomerReviewsController
  implements BaseCustomerReviewsControllerInterface
{
  constructor(private readonly service: CustomerReviewsService) {}

  /**
   * DELETE /v1/reviews/:reviewId
   */
  async deleteReview(params: DeleteReviewParams): Promise<void> {
    await this.service.deleteReview(params);
  }

  /**
   * GET /v1/reviews
   */
  async getReviews(
    query: GetReviewsQueryParams,
  ): Promise<GetReviews200Response> {
    return await this.service.getReviews(query);
  }

  /**
   * GET /v1/reviews/:reviewId
   */
  async getReviewById(
    params: GetReviewByIdParams,
  ): Promise<GetReviewById200Response> {
    return await this.service.getReviewById(params);
  }

  /**
   * PATCH /v1/reviews/:reviewId
   */
  async patchReview(
    params: PatchReviewParams,

    body: PatchReviewBody,
  ): Promise<void> {
    await this.service.patchReview(
      params,

      body,
    );
  }

  /**
   * POST /v1/reviews
   */
  async postReview(body: PostReviewBody): Promise<PostReview201Response> {
    return await this.service.postReview(body);
  }
}
