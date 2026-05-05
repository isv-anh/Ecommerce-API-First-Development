import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  BaseOrdersController,
  ORDERS_CONTROLLER,
} from '@generated-controller/order/orders/base-orders.controller';
import { OrdersRepository } from '@/api/v1/order/orders/orders.repository';

@Module({
  controllers: [BaseOrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_CONTROLLER,
      useClass: OrdersController,
    },
    OrdersRepository,
  ],
})
export class OrdersModule {}
