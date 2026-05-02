import { Module } from '@nestjs/common';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {
  BaseCategoriesController,
  CATEGORIES_CONTROLLER,
} from '@generated-controller/product/categories/base-categories.controller';
import { CategoriesRepository } from '@/product/categories/categories.repository';

@Module({
  controllers: [BaseCategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_CONTROLLER,
      useClass: CategoriesController,
    },
    CategoriesRepository,
  ],
})
export class CategoriesModule {}
