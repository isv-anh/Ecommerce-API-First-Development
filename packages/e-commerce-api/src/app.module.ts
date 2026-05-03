import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/services/prisma.module';
import { HealthModule } from './health.module';
import { AuthModule } from './api/v1/auth/auth/auth.module';
import { CategoriesModule } from '@/api/v1/product/categories/categories.module';
import { BrandsModule } from '@/api/v1/product/brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
  ],
})
export class AppModule {}
