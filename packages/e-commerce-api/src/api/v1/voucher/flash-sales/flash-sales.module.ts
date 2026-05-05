import { Module } from '@nestjs/common';
import { FlashSalesController } from './flash-sales.controller';
import { FlashSalesService } from './flash-sales.service';
import {
  BaseFlashSalesController,
  FLASH_SALES_CONTROLLER,
} from '@generated-controller/voucher/flash-sales/base-flash-sales.controller';
import { FlashSalesRepository } from '@/api/v1/voucher/flash-sales/flash-sales.repository';

@Module({
  controllers: [BaseFlashSalesController],
  providers: [
    FlashSalesService,
    {
      provide: FLASH_SALES_CONTROLLER,
      useClass: FlashSalesController,
    },
    FlashSalesRepository,
  ],
})
export class FlashSalesModule {}
