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

  // --- API Gateway methods ---

  @GrpcMethod('OrderService', 'CreateOrder')
  createOrder(data: any) {
    return this.appService.createOrder(data);
  }

  @GrpcMethod('OrderService', 'GetOrders')
  getOrders(data: any) {
    return this.appService.getOrders(data);
  }

  @GrpcMethod('OrderService', 'GetOrderById')
  getOrderById(data: any) {
    return this.appService.getOrderById(data);
  }

  @GrpcMethod('OrderService', 'DeleteOrder')
  deleteOrder(data: any) {
    return this.appService.deleteOrder(data);
  }
}
