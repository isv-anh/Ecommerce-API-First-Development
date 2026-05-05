import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/services/prisma.module';
import { HealthModule } from './health.module';
import { AuthModule } from './api/v1/auth/auth/auth.module';
import { CategoriesModule } from '@/api/v1/product/categories/categories.module';
import { BrandsModule } from '@/api/v1/product/brands/brands.module';
import { ShopsModule } from '@/api/v1/shop/shops/shops.module';
import { CustomerAddressesModule } from '@/api/v1/customer/customer-addresses/customer-addresses.module';
import { CustomerReviewsModule } from '@/api/v1/customer/customer-reviews/customer-reviews.module';
import { CustomerWishlistItemsModule } from '@/api/v1/customer/customer-wishlist-items/customer-wishlist-items.module';
import { CustomerWishlistsModule } from '@/api/v1/customer/customer-wishlists/customer-wishlists.module';
import { ProductsModule } from '@/api/v1/product/products/products.module';
import { ProductVariantsModule } from '@/api/v1/product/product-variants/product-variants.module';
import { WarehouseInventoriesModule } from '@/api/v1/product/warehouse-inventories/warehouse-inventories.module';
import { WarehousesModule } from '@/api/v1/product/warehouses/warehouses.module';
import { FlashSalesModule } from '@/api/v1/voucher/flash-sales/flash-sales.module';
import { OrderVouchersModule } from '@/api/v1/voucher/order-vouchers/order-vouchers.module';
import { VoucherConditionsModule } from '@/api/v1/voucher/voucher-conditions/voucher-conditions.module';
import { VouchersModule } from '@/api/v1/voucher/vouchers/vouchers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ShopsModule,
    CustomerAddressesModule,
    CustomerReviewsModule,
    CustomerWishlistItemsModule,
    CustomerWishlistsModule,
    ProductsModule,
    ProductVariantsModule,
    WarehousesModule,
    WarehouseInventoriesModule,
    FlashSalesModule,
    OrderVouchersModule,
    VoucherConditionsModule,
    VouchersModule,
  ],
})
export class AppModule {}
