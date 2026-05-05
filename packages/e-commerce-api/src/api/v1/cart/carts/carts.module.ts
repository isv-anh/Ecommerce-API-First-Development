import { Module } from '@nestjs/common';

import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import {
  BaseCartsController,
  CARTS_CONTROLLER,
} from '@generated-controller/cart/carts/base-carts.controller';
import { CartsRepository } from '@/api/v1/cart/carts/carts.repository';

@Module({
  controllers: [BaseCartsController],
  providers: [
    CartsService,
    {
      provide: CARTS_CONTROLLER,
      useClass: CartsController,
    },
    CartsRepository,
  ],
})
export class CartsModule {}
