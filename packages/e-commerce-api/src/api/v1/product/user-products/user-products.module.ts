import { Module } from '@nestjs/common';
import {
  BaseUserProductsController,
  USER_PRODUCTS_CONTROLLER,
} from '@generated-controller/product/user-products/base-user-products.controller';

import { ProductsModule } from '@/api/v1/product/products/products.module';
import { UserProductsService } from '@/api/v1/product/user-products/user-products.service';
import { UserProductsController } from '@/api/v1/product/user-products/user-products.controller';

@Module({
  imports: [ProductsModule],
  controllers: [BaseUserProductsController],
  providers: [
    UserProductsService,
    {
      provide: USER_PRODUCTS_CONTROLLER,
      useClass: UserProductsController,
    },
  ],
})
export class UserProductsModule {}
