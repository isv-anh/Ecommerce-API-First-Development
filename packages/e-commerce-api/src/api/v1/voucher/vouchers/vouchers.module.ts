import { Module } from '@nestjs/common';

import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import {
  BaseVouchersController,
  VOUCHERS_CONTROLLER,
} from '@generated-controller/voucher/vouchers/base-vouchers.controller';
import { VouchersRepository } from '@/api/v1/voucher/vouchers/vouchers.repository';

@Module({
  controllers: [BaseVouchersController],
  providers: [
    VouchersService,
    {
      provide: VOUCHERS_CONTROLLER,
      useClass: VouchersController,
    },
    VouchersRepository,
  ],
})
export class VouchersModule {}
