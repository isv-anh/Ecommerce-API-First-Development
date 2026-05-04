import { Module } from '@nestjs/common';

import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';
import {
  BaseProductVariantsController,
  PRODUCT_VARIANTS_CONTROLLER,
} from '@generated-controller/product/product-variants/base-product-variants.controller';
import { ProductVariantsRepository } from '@/api/v1/product/product-variants/product-variants.repository';

@Module({
  controllers: [BaseProductVariantsController],
  providers: [
    ProductVariantsService,
    {
      provide: PRODUCT_VARIANTS_CONTROLLER,
      useClass: ProductVariantsController,
    },
    ProductVariantsRepository,
  ],
})
export class ProductVariantsModule {}
