import { Module } from '@nestjs/common';

import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import {
  BaseBrandsController,
  BRANDS_CONTROLLER,
} from '@generated-controller/product/brands/base-brands.controller';
import { BrandsRepository } from '@/product/brands/brands.repository';

@Module({
  controllers: [BaseBrandsController],
  providers: [
    BrandsService,
    {
      provide: BRANDS_CONTROLLER,
      useClass: BrandsController,
    },
    BrandsRepository,
  ],
})
export class BrandsModule {}
