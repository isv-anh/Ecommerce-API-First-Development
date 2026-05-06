import { Injectable } from '@nestjs/common';
import { VoucherConditionsService } from './voucher-conditions.service';
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
import { BaseVoucherConditionsControllerInterface } from '@generated-controller/voucher/voucher-conditions/base-voucher-conditions.controller.interface';

@Injectable()
export class VoucherConditionsController
  implements BaseVoucherConditionsControllerInterface
{
  constructor(private readonly service: VoucherConditionsService) {}
  async getVoucherConditionById(
    params: GetVoucherConditionByIdParams,
  ): Promise<GetVoucherConditionById200Response> {
    return await this.service.getVoucherConditionById(params);
  }

  /**
   * DELETE /v1/vouchers/:voucherId/conditions/:conditionId
   */
  async deleteVoucherCondition(
    params: DeleteVoucherConditionParams,
  ): Promise<void> {
    await this.service.deleteVoucherCondition(params);
  }

  /**
   * GET /v1/vouchers/:voucherId/conditions
   */
  async getVoucherConditions(
    params: GetVoucherConditionsParams,
  ): Promise<GetVoucherConditions200Response> {
    return await this.service.getVoucherConditions(params);
  }

  /**
   * POST /v1/vouchers/:voucherId/conditions
   */
  async postVoucherCondition(
    params: PostVoucherConditionParams,

    body: PostVoucherConditionBody,
  ): Promise<PostVoucherCondition201Response> {
    return await this.service.postVoucherCondition(
      params,

      body,
    );
  }
}
