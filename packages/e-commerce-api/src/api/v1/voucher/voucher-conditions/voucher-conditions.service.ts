import { Injectable } from '@nestjs/common';
import type {
  DeleteVoucherConditionParams,
  GetVoucherConditionsParams,
  GetVoucherConditions200Response,
  PostVoucherConditionParams,
  PostVoucherConditionBody,
  PostVoucherCondition201Response,
  GetVoucherConditionById200Response,
  GetVoucherConditionByIdParams,
} from '@e-commerce/api-validation/types/voucher';
import type { BaseVoucherConditionsControllerInterface } from '@generated-controller/voucher/voucher-conditions/base-voucher-conditions.controller.interface';
import { VoucherConditionsRepository } from '@/api/v1/voucher/voucher-conditions/voucher-conditions.repository';

@Injectable()
export class VoucherConditionsService
  implements BaseVoucherConditionsControllerInterface
{
  constructor(
    private readonly voucherConditionsRepository: VoucherConditionsRepository,
  ) {}
  getVoucherConditionById(
    params: GetVoucherConditionByIdParams,
  ): Promise<GetVoucherConditionById200Response> {
    console.log('getVoucherConditionById called with params:', params);
    throw new Error('Method not implemented.');
  }

  /**
   * DELETE /v1/vouchers/:voucherId/conditions/:conditionId
   */
  async deleteVoucherCondition(
    params: DeleteVoucherConditionParams,
  ): Promise<void> {
    await this.voucherConditionsRepository.deleteVoucherCondition(
      params.conditionId,
    );
  }

  /**
   * GET /v1/vouchers/:voucherId/conditions
   */
  async getVoucherConditions(
    params: GetVoucherConditionsParams,
  ): Promise<GetVoucherConditions200Response> {
    return await this.voucherConditionsRepository.getVoucherConditions(
      params.voucherId,
    );
  }

  /**
   * POST /v1/vouchers/:voucherId/conditions
   */
  async postVoucherCondition(
    params: PostVoucherConditionParams,

    body: PostVoucherConditionBody,
  ): Promise<PostVoucherCondition201Response> {
    const conditionId =
      await this.voucherConditionsRepository.createVoucherCondition(
        params.voucherId,
        body,
      );
    return { conditionId };
  }
}
