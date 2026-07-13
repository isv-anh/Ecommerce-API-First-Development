import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  BaseProductsController,
  PRODUCTS_CONTROLLER,
} from '@generated-controller/product/products/base-products.controller';
import { ProductsRepository } from '@/api/v1/product/products/products.repository';

@Module({
  controllers: [BaseProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_CONTROLLER,
      useClass: ProductsController,
    },
    ProductsRepository,
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}
