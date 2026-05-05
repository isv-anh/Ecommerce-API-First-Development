import { Injectable } from '@nestjs/common';
import { OrderVouchersService } from './order-vouchers.service';
import type {
  DeleteOrderVoucherParams,
  GetOrderVoucherByIdParams,
  GetOrderVoucherById200Response,
  GetOrderVouchersQueryParams,
  GetOrderVouchers200Response,
  PostOrderVoucherBody,
  PostOrderVoucher201Response,
} from '@e-commerce/api-validation/types/voucher';
import { BaseOrderVouchersControllerInterface } from '@generated-controller/voucher/order-vouchers/base-order-vouchers.controller.interface';

@Injectable()
export class OrderVouchersController
  implements BaseOrderVouchersControllerInterface
{
  constructor(private readonly service: OrderVouchersService) {}

  /**
   * DELETE /api/v1/order-vouchers/:orderVoucherId
   * @param params - path parameters
   */
  async deleteOrderVoucher(params: DeleteOrderVoucherParams): Promise<void> {
    await this.service.deleteOrderVoucher(params);
  }

  /**
   * GET /api/v1/order-vouchers/:orderVoucherId
   * @param params - path parameters
   * @returns order-voucher details
   */
  async getOrderVoucherById(
    params: GetOrderVoucherByIdParams,
  ): Promise<GetOrderVoucherById200Response> {
    return await this.service.getOrderVoucherById(params);
  }

  /**
   * GET /api/v1/order-vouchers
   * @param query - query parameters
   * @returns list of order-vouchers
   */
  async getOrderVouchers(
    query: GetOrderVouchersQueryParams,
  ): Promise<GetOrderVouchers200Response> {
    return await this.service.getOrderVouchers(query);
  }

  /**
   * POST /api/v1/order-vouchers
   * @param body - creation data
   * @returns created order-voucher id
   */
  async postOrderVoucher(
    body: PostOrderVoucherBody,
  ): Promise<PostOrderVoucher201Response> {
    return await this.service.postOrderVoucher(body);
  }
}
