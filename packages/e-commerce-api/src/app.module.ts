import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/services/prisma.module';
import { HealthModule } from './health.module';
import { AuthModule } from './auth/auth/auth.module';
import { CategoriesModule } from '@/product/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CategoriesModule,
  ],
})
export class AppModule {}
