import { Module } from '@nestjs/common';

import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import {
  BaseWarehousesController,
  WAREHOUSES_CONTROLLER,
} from '@generated-controller/product/warehouses/base-warehouses.controller';
import { WarehousesRepository } from '@/api/v1/product/warehouses/warehouses.repository';

@Module({
  controllers: [BaseWarehousesController],
  providers: [
    WarehousesService,
    {
      provide: WAREHOUSES_CONTROLLER,
      useClass: WarehousesController,
    },
    WarehousesRepository,
  ],
})
export class WarehousesModule {}
