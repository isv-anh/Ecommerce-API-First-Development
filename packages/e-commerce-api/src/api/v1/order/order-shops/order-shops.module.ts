import { Module } from '@nestjs/common';
import { OrderShopsController } from './order-shops.controller';
import { OrderShopsService } from './order-shops.service';
import {
  BaseOrderShopsController,
  ORDER_SHOPS_CONTROLLER,
} from '@generated-controller/order/order-shops/base-order-shops.controller';
import { OrderShopsRepository } from '@/api/v1/order/order-shops/order-shops.repository';

@Module({
  controllers: [BaseOrderShopsController],
  providers: [
    OrderShopsService,
    {
      provide: ORDER_SHOPS_CONTROLLER,
      useClass: OrderShopsController,
    },
    OrderShopsRepository,
  ],
})
export class OrderShopsModule {}
