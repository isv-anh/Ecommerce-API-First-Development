import { Module } from '@nestjs/common';

import { CustomerWishlistsController } from './customer-wishlists.controller';
import { CustomerWishlistsService } from './customer-wishlists.service';
import { CustomerWishlistsRepository } from '@/api/v1/customer/customer-wishlists/customer-wishlists.repository';
import {
  BaseCustomerWishlistsController,
  CUSTOMER_WISHLISTS_CONTROLLER,
} from '@generated-controller/customer/customer-wishlists/base-customer-wishlists.controller';

@Module({
  controllers: [BaseCustomerWishlistsController],
  providers: [
    CustomerWishlistsService,
    {
      provide: CUSTOMER_WISHLISTS_CONTROLLER,
      useClass: CustomerWishlistsController,
    },
    CustomerWishlistsRepository,
  ],
})
export class CustomerWishlistsModule {}
