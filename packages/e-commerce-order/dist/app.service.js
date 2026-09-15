var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
let AppService = class AppService {
    orders = new Map();
    placeOrder(data) {
        const orderId = randomUUID();
        const order = {
            orderId,
            customerId: data.customerId,
            items: data.items || [],
            status: 'CREATED',
            totalAmount: data.items?.reduce((sum, item) => sum + (item.quantity * 10), 0) || 0,
        };
        this.orders.set(orderId, order);
        return {
            orderId,
            status: order.status,
            message: 'Order created successfully'
        };
    }
    getOrder(data) {
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
    cancelOrder(data) {
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
};
AppService = __decorate([
    Injectable()
], AppService);
export { AppService };
//# sourceMappingURL=app.service.js.map