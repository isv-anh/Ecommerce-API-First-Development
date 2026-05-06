import { Module } from '@nestjs/common';

import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import {
  BaseShopsController,
  SHOPS_CONTROLLER,
} from '@generated-controller/shop/shops/base-shops.controller';
import { ShopsRepository } from '@/api/v1/shop/shops/shops.repository';

@Module({
  controllers: [BaseShopsController],
  providers: [
    ShopsService,
    {
      provide: SHOPS_CONTROLLER,
      useClass: ShopsController,
    },
    ShopsRepository,
  ],
})
export class ShopsModule {}
