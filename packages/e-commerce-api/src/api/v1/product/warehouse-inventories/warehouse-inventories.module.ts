import { Module } from '@nestjs/common';

import { WarehouseInventoriesController } from './warehouse-inventories.controller';
import { WarehouseInventoriesService } from './warehouse-inventories.service';

import { WarehouseInventoriesRepository } from '@/api/v1/product/warehouse-inventories/warehouse-inventories.repository';
import {
  BaseWarehouseInventoriesController,
  WAREHOUSE_INVENTORIES_CONTROLLER,
} from '@generated-controller/product/warehouse-inventories/base-warehouse-inventories.controller';

@Module({
  controllers: [BaseWarehouseInventoriesController],
  providers: [
    WarehouseInventoriesService,
    {
      provide: WAREHOUSE_INVENTORIES_CONTROLLER,
      useClass: WarehouseInventoriesController,
    },
    WarehouseInventoriesRepository,
  ],
})
export class WarehouseInventoriesModule {}
