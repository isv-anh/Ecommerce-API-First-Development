import { Injectable } from '@nestjs/common';
import type {
  DeleteOrderVoucherParams,
  GetOrderVoucherByIdParams,
  GetOrderVoucherById200Response,
  GetOrderVouchersQueryParams,
  GetOrderVouchers200Response,
  PostOrderVoucherBody,
  PostOrderVoucher201Response,
} from '@e-commerce/api-validation/types/voucher';
import type { BaseOrderVouchersControllerInterface } from '@generated-controller/voucher/order-vouchers/base-order-vouchers.controller.interface';
import { OrderVouchersRepository } from '@/api/v1/voucher/order-vouchers/order-vouchers.repository';

@Injectable()
export class OrderVouchersService implements BaseOrderVouchersControllerInterface {
  constructor(
    private readonly orderVouchersRepository: OrderVouchersRepository,
  ) {}

  /**
   * DELETE /api/v1/order-vouchers/:orderVoucherId
   * @param params - path parameters with orderVoucherId
   */
  async deleteOrderVoucher(params: DeleteOrderVoucherParams): Promise<void> {
    await this.orderVouchersRepository.deleteOrderVoucher(
      params.orderVoucherId,
    );
  }

  /**
   * GET /api/v1/order-vouchers/:orderVoucherId
   * @param params - path parameters with orderVoucherId
   * @returns order-voucher details
   */
  async getOrderVoucherById(
    params: GetOrderVoucherByIdParams,
  ): Promise<GetOrderVoucherById200Response> {
    return await this.orderVouchersRepository.getOrderVoucherById(
      params.orderVoucherId,
    );
  }

  /**
   * GET /api/v1/order-vouchers
   * @param query - query parameters
   * @returns list of order-vouchers
   */
  async getOrderVouchers(
    query: GetOrderVouchersQueryParams,
  ): Promise<GetOrderVouchers200Response> {
    return await this.orderVouchersRepository.getOrderVouchers(query);
  }

  /**
   * POST /api/v1/order-vouchers
   * @param body - order-voucher creation data
   * @returns created order-voucher id
   */
  async postOrderVoucher(
    body: PostOrderVoucherBody,
  ): Promise<PostOrderVoucher201Response> {
    const orderVoucherId =
      await this.orderVouchersRepository.createOrderVoucher(body);
    return { orderVoucherId };
  }
}
