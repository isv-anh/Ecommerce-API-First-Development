import { Injectable } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import type {
  DeleteVoucherParams,
  GetVouchersQueryParams,
  GetVouchers200Response,
  GetVoucherByIdParams,
  GetVoucherById200Response,
  PatchVoucherParams,
  PatchVoucherBody,
  PostVoucherBody,
  PostVoucher201Response,
} from '@e-commerce/api-validation/types/voucher';
import { BaseVouchersControllerInterface } from '@generated-controller/voucher/vouchers/base-vouchers.controller.interface';

@Injectable()
export class VouchersController implements BaseVouchersControllerInterface {
  constructor(private readonly service: VouchersService) {}

  /**
   * DELETE /v1/vouchers/:voucherId
   */
  async deleteVoucher(params: DeleteVoucherParams): Promise<void> {
    await this.service.deleteVoucher(params);
  }

  /**
   * GET /v1/vouchers
   */
  async getVouchers(
    query: GetVouchersQueryParams,
  ): Promise<GetVouchers200Response> {
    return await this.service.getVouchers(query);
  }

  /**
   * GET /v1/vouchers/:voucherId
   */
  async getVoucherById(
    params: GetVoucherByIdParams,
  ): Promise<GetVoucherById200Response> {
    return await this.service.getVoucherById(params);
  }

  /**
   * PATCH /v1/vouchers/:voucherId
   */
  async patchVoucher(
    params: PatchVoucherParams,

    body: PatchVoucherBody,
  ): Promise<void> {
    await this.service.patchVoucher(
      params,

      body,
    );
  }

  /**
   * POST /v1/vouchers
   */
  async postVoucher(body: PostVoucherBody): Promise<PostVoucher201Response> {
    return await this.service.postVoucher(body);
  }
}
