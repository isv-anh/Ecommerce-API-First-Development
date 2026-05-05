import { PrismaService } from '@/common/services/prisma.service';
import {
  GetOrderVouchers200Response,
  GetOrderVouchersQueryParams,
  GetOrderVoucherById200Response,
  PostOrderVoucherBody,
} from '@e-commerce/api-validation/types/voucher';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class OrderVouchersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete an order-voucher by id
   * @param orderVoucherId - the order-voucher id
   */
  async deleteOrderVoucher(orderVoucherId: string): Promise<void> {
    try {
      await this.prisma.order_vouchers.delete({
        where: { id: orderVoucherId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Order Voucher not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of order-vouchers with optional filter by orderId
   * @param query - query parameters including optional orderId
   * @returns list of order-vouchers
   */
  async getOrderVouchers(
    query: GetOrderVouchersQueryParams,
  ): Promise<GetOrderVouchers200Response> {
    const result = await this.prisma.order_vouchers.findMany({
      where: {
        order_id: query.orderId,
      },
    });

    const orderVouchers = result.map((ov) => ({
      orderVoucherId: ov.id,
      orderId: ov.order_id,
      voucherId: ov.voucher_id,
      discountAmount: Number(ov.discount_amount ?? 0),
    }));

    return { orderVouchers };
  }

  /**
   * Get a single order-voucher by id
   * @param orderVoucherId - the order-voucher id
   * @returns order-voucher details
   */
  async getOrderVoucherById(
    orderVoucherId: string,
  ): Promise<GetOrderVoucherById200Response> {
    const ov = await this.prisma.order_vouchers.findUnique({
      where: { id: orderVoucherId },
    });

    if (!ov) {
      throw new NotFoundException('Order Voucher not found');
    }

    return {
      orderVoucherId: ov.id,
      orderId: ov.order_id,
      voucherId: ov.voucher_id,
      discountAmount: Number(ov.discount_amount ?? 0),
    };
  }

  /**
   * Create a new order-voucher
   * @param data - body with orderId, voucherId, discountAmount
   * @returns the new order-voucher id
   */
  async createOrderVoucher(data: PostOrderVoucherBody): Promise<string> {
    const orderVoucherId = crypto.randomUUID();
    await this.prisma.order_vouchers.create({
      data: {
        id: orderVoucherId,
        order_id: data.orderId,
        voucher_id: data.voucherId,
        discount_amount: data.discountAmount,
      },
    });
    return orderVoucherId;
  }
}
