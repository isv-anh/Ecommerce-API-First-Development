import { Module } from '@nestjs/common';
import { OrderVouchersController } from './order-vouchers.controller';
import { OrderVouchersService } from './order-vouchers.service';
import {
  BaseOrderVouchersController,
  ORDER_VOUCHERS_CONTROLLER,
} from '@generated-controller/voucher/order-vouchers/base-order-vouchers.controller';
import { OrderVouchersRepository } from '@/api/v1/voucher/order-vouchers/order-vouchers.repository';

@Module({
  controllers: [BaseOrderVouchersController],
  providers: [
    OrderVouchersService,
    {
      provide: ORDER_VOUCHERS_CONTROLLER,
      useClass: OrderVouchersController,
    },
    OrderVouchersRepository,
  ],
})
export class OrderVouchersModule {}
