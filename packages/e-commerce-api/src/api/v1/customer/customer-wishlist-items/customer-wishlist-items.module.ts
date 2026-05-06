import { Module } from '@nestjs/common';

import { CustomerWishlistItemsController } from './customer-wishlist-items.controller';
import { CustomerWishlistItemsService } from './customer-wishlist-items.service';

import { CustomerWishlistItemsRepository } from '@/api/v1/customer/customer-wishlist-items/customer-wishlist-items.repository';
import {
  BaseCustomerWishlistItemsController,
  CUSTOMER_WISHLIST_ITEMS_CONTROLLER,
} from '@generated-controller/customer/customer-wishlist-items/base-customer-wishlist-items.controller';

@Module({
  controllers: [BaseCustomerWishlistItemsController],
  providers: [
    CustomerWishlistItemsService,
    {
      provide: CUSTOMER_WISHLIST_ITEMS_CONTROLLER,
      useClass: CustomerWishlistItemsController,
    },
    CustomerWishlistItemsRepository,
  ],
})
export class CustomerWishlistItemsModule {}
