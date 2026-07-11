import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UserProductsController } from './user-products.controller';
import {
  BaseProductsController,
  PRODUCTS_CONTROLLER,
} from '@generated-controller/product/products/base-products.controller';
import { ProductsRepository } from '@/api/v1/product/products/products.repository';

@Module({
  controllers: [BaseProductsController, UserProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_CONTROLLER,
      useClass: ProductsController,
    },
    ProductsRepository,
  ],
})
export class ProductsModule {}
