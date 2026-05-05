import { Module } from '@nestjs/common';
import { OrderPaymentsController } from './order-payments.controller';
import { OrderPaymentsService } from './order-payments.service';
import {
  BaseOrderPaymentsController,
  ORDER_PAYMENTS_CONTROLLER,
} from '@generated-controller/order/order-payments/base-order-payments.controller';
import { OrderPaymentsRepository } from '@/api/v1/order/order-payments/order-payments.repository';

@Module({
  controllers: [BaseOrderPaymentsController],
  providers: [
    OrderPaymentsService,
    {
      provide: ORDER_PAYMENTS_CONTROLLER,
      useClass: OrderPaymentsController,
    },
    OrderPaymentsRepository,
  ],
})
export class OrderPaymentsModule {}
