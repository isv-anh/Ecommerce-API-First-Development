import { Module } from '@nestjs/common';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {
  BaseSearchController,
  SEARCH_CONTROLLER,
} from '@generated-controller/product/search/base-search.controller';

@Module({
  controllers: [BaseSearchController],
  providers: [
    SearchService,
    {
      provide: SEARCH_CONTROLLER,
      useClass: SearchController,
    },
  ],
})
export class SearchModule {}
