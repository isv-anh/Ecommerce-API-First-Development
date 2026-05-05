import { Module } from '@nestjs/common';

import { VoucherConditionsController } from './voucher-conditions.controller';
import { VoucherConditionsService } from './voucher-conditions.service';
import {
  BaseVoucherConditionsController,
  VOUCHER_CONDITIONS_CONTROLLER,
} from '@generated-controller/voucher/voucher-conditions/base-voucher-conditions.controller';
import { VoucherConditionsRepository } from '@/api/v1/voucher/voucher-conditions/voucher-conditions.repository';

@Module({
  controllers: [BaseVoucherConditionsController],
  providers: [
    VoucherConditionsService,
    {
      provide: VOUCHER_CONDITIONS_CONTROLLER,
      useClass: VoucherConditionsController,
    },
    VoucherConditionsRepository,
  ],
})
export class VoucherConditionsModule {}
