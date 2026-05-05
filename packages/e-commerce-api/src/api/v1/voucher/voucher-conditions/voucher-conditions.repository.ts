import { PrismaService } from '@/common/services/prisma.service';
import {
  GetVoucherConditions200Response,
  PostVoucherConditionBody,
} from '@e-commerce/api-validation/types/voucher';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class VoucherConditionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteVoucherCondition(conditionId: string): Promise<void> {
    try {
      await this.prisma.voucher_conditions.delete({
        where: { id: conditionId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Voucher Condition not found');
      }
      throw error;
    }
  }

  async getVoucherConditions(
    voucherId: string,
  ): Promise<GetVoucherConditions200Response> {
    const conditionsResult = await this.prisma.voucher_conditions.findMany({
      where: { voucher_id: voucherId },
    });

    const conditions = conditionsResult.map((c) => ({
      conditionId: c.id,
      voucherId: c.voucher_id,
      type: c.type || '',
      refId: c.ref_id || '',
    }));

    return {
      voucherConditions: conditions,
    };
  }

  async createVoucherCondition(
    voucherId: string,
    data: PostVoucherConditionBody,
  ): Promise<string> {
    const conditionId = crypto.randomUUID();
    await this.prisma.voucher_conditions.create({
      data: {
        id: conditionId,
        voucher_id: voucherId,
        type: data.type,
        ref_id: data.refId,
      },
    });
    return conditionId;
  }
}
