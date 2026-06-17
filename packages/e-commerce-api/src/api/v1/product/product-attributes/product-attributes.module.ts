import { Module } from '@nestjs/common';

import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributesService } from './product-attributes.service';
import {
  BaseProductAttributesController,
  PRODUCT_ATTRIBUTES_CONTROLLER,
} from '@generated-controller/product/product-attributes/base-product-attributes.controller';
import { ProductAttributesRepository } from '@/api/v1/product/product-attributes/product-attributes.repository';

@Module({
  controllers: [BaseProductAttributesController],
  providers: [
    ProductAttributesService,
    ProductAttributesRepository,
    {
      provide: PRODUCT_ATTRIBUTES_CONTROLLER,
      useClass: ProductAttributesController,
    },
  ],
})
export class ProductAttributesModule {}
