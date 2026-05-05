import { PrismaService } from '@/common/services/prisma.service';
import {
  GetPayments200Response,
  GetPaymentById200Response,
  PatchPaymentBody,
  PostPaymentBody,
} from '@e-commerce/api-validation/types/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class OrderPaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete a payment by id
   * @param paymentId - the payment id
   */
  async deletePayment(paymentId: string): Promise<void> {
    try {
      await this.prisma.payments.delete({
        where: { id: paymentId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Payment not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of payments for a specific order
   * @param orderId - the order id
   * @returns list of payments
   */
  async getPayments(orderId: string): Promise<GetPayments200Response> {
    const result = await this.prisma.payments.findMany({
      where: {
        order_id: orderId,
      },
    });

    const payments = result.map((p) => ({
      paymentId: p.id,
      orderId: p.order_id,
      method: p.method ?? '',
      status: p.status ?? '',
      amount: Number(p.amount ?? 0),
      createdAt: p.created_at?.toISOString() ?? '',
    }));

    return { payments };
  }

  /**
   * Get a single payment by id
   * @param paymentId - the payment id
   * @returns payment details
   */
  async getPaymentById(paymentId: string): Promise<GetPaymentById200Response> {
    const p = await this.prisma.payments.findUnique({
      where: { id: paymentId },
    });

    if (!p) {
      throw new NotFoundException('Payment not found');
    }

    return {
      paymentId: p.id,
      orderId: p.order_id,
      method: p.method ?? '',
      status: p.status ?? '',
      amount: Number(p.amount ?? 0),
      createdAt: p.created_at?.toISOString() ?? '',
    };
  }

  /**
   * Update a payment by id
   * @param paymentId - the payment id
   * @param data - partial update data
   */
  async updatePayment(
    paymentId: string,
    data: PatchPaymentBody,
  ): Promise<void> {
    await this.prisma.payments.update({
      where: { id: paymentId },
      data: {
        method: data.method,
        status: data.status,
      },
    });
  }

  /**
   * Create a new payment
   * @param orderId - the order id
   * @param data - payment creation data
   * @returns the new payment id
   */
  async createPayment(orderId: string, data: PostPaymentBody): Promise<string> {
    const paymentId = crypto.randomUUID();
    await this.prisma.payments.create({
      data: {
        id: paymentId,
        order_id: orderId,
        method: data.method,
        amount: data.amount ?? 0,
        created_at: new Date(),
      },
    });
    return paymentId;
  }
}
