import { Module } from '@nestjs/common';

import { CustomerReviewsRepository } from '@/api/v1/customer/customer-reviews/customer-reviews.repository';
import {
  BaseCustomerReviewsController,
  CUSTOMER_REVIEWS_CONTROLLER,
} from '@generated-controller/customer/customer-reviews/base-customer-reviews.controller';
import { CustomerReviewsController } from '@/api/v1/customer/customer-reviews/customer-reviews.controller';
import { CustomerReviewsService } from '@/api/v1/customer/customer-reviews/customer-reviews.service';

@Module({
  controllers: [BaseCustomerReviewsController],
  providers: [
    CustomerReviewsService,
    {
      provide: CUSTOMER_REVIEWS_CONTROLLER,
      useClass: CustomerReviewsController,
    },
    CustomerReviewsRepository,
  ],
})
export class CustomerReviewsModule {}
