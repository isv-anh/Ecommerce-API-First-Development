import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import {
  BaseOrderItemsController,
  ORDER_ITEMS_CONTROLLER,
} from '@generated-controller/order/order-items/base-order-items.controller';
import { OrderItemsRepository } from '@/api/v1/order/order-items/order-items.repository';

@Module({
  controllers: [BaseOrderItemsController],
  providers: [
    OrderItemsService,
    {
      provide: ORDER_ITEMS_CONTROLLER,
      useClass: OrderItemsController,
    },
    OrderItemsRepository,
  ],
})
export class OrderItemsModule {}
