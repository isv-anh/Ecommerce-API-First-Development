import { Injectable } from '@nestjs/common';
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
import type { BaseVouchersControllerInterface } from '@generated-controller/voucher/vouchers/base-vouchers.controller.interface';
import { VouchersRepository } from '@/api/v1/voucher/vouchers/vouchers.repository';

@Injectable()
export class VouchersService implements BaseVouchersControllerInterface {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  /**
   * DELETE /v1/vouchers/:voucherId
   */
  async deleteVoucher(params: DeleteVoucherParams): Promise<void> {
    await this.vouchersRepository.deleteVoucher(params.voucherId);
  }

  /**
   * GET /v1/vouchers
   */
  async getVouchers(
    query: GetVouchersQueryParams,
  ): Promise<GetVouchers200Response> {
    return await this.vouchersRepository.getVouchers(query);
  }

  /**
   * GET /v1/vouchers/:voucherId
   */
  async getVoucherById(
    params: GetVoucherByIdParams,
  ): Promise<GetVoucherById200Response> {
    return await this.vouchersRepository.getVoucherById(params.voucherId);
  }

  /**
   * PATCH /v1/vouchers/:voucherId
   */
  async patchVoucher(
    params: PatchVoucherParams,

    body: PatchVoucherBody,
  ): Promise<void> {
    await this.vouchersRepository.updateVoucher(params.voucherId, body);
  }

  /**
   * POST /v1/vouchers
   */
  async postVoucher(body: PostVoucherBody): Promise<PostVoucher201Response> {
    const voucherId = await this.vouchersRepository.createVoucher(body);
    return { voucherId };
  }
}
