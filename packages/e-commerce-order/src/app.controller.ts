import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('OrderService', 'PlaceOrder')
  placeOrder(data: any) {
    return this.appService.placeOrder(data);
  }

  @GrpcMethod('OrderService', 'GetOrder')
  getOrder(data: any) {
    return this.appService.getOrder(data);
  }

  @GrpcMethod('OrderService', 'CancelOrder')
  cancelOrder(data: any) {
    return this.appService.cancelOrder(data);
  }
}
