import { Module } from '@nestjs/common';

import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import {
  BaseCartItemsController,
  CART_ITEMS_CONTROLLER,
} from '@generated-controller/cart/cart-items/base-cart-items.controller';
import { CartItemsRepository } from '@/api/v1/cart/cart-items/cart-items.repository';

@Module({
  controllers: [BaseCartItemsController],
  providers: [
    CartItemsService,
    {
      provide: CART_ITEMS_CONTROLLER,
      useClass: CartItemsController,
    },
    CartItemsRepository,
  ],
})
export class CartItemsModule {}
