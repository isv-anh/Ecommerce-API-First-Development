import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  BaseOrdersController,
  ORDERS_CONTROLLER,
} from '@generated-controller/order/orders/base-orders.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'order.v1',
          protoPath: join(process.cwd(), '../proto/order/v1/order.proto'),
          url: '0.0.0.0:50052',
        },
      },
    ]),
  ],
  controllers: [BaseOrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_CONTROLLER,
      useClass: OrdersController,
    },
  ],
})
export class OrdersModule {}
