import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  private readonly orders = new Map<string, any>();

  placeOrder(data: any): any {
    const orderId = randomUUID();
    const order = {
      orderId,
      customerId: data.customerId,
      items: data.items || [],
      status: 'CREATED',
      totalAmount: data.items?.reduce((sum: number, item: any) => sum + (item.quantity * 10), 0) || 0, // Mock amount calculation
    };
    this.orders.set(orderId, order);
    
    return {
      orderId,
      status: order.status,
      message: 'Order created successfully'
    };
  }

  getOrder(data: any): any {
    const order = this.orders.get(data.orderId);
    if (!order) {
      return {
        orderId: data.orderId,
        status: 'NOT_FOUND',
        message: 'Order not found'
      };
    }
    return order;
  }

  cancelOrder(data: any): any {
    const order = this.orders.get(data.orderId);
    if (!order) {
      return {
        success: false,
        message: 'Order not found'
      };
    }
    
    order.status = 'CANCELLED';
    this.orders.set(data.orderId, order);
    
    return {
      success: true,
      message: `Order cancelled due to: ${data.reason}`
    };
  }
}
