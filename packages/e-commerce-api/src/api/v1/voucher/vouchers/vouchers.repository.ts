import { PrismaService } from '@/common/services/prisma.service';
import {
  GetVouchers200Response,
  GetVouchersQueryParams,
  GetVoucherById200Response,
  PatchVoucherBody,
  PostVoucherBody,
} from '@e-commerce/api-validation/types/voucher';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class VouchersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteVoucher(voucherId: string): Promise<void> {
    try {
      await this.prisma.vouchers.delete({
        where: { id: voucherId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Voucher not found');
      }
      throw error;
    }
  }

  async getVouchers(
    query: GetVouchersQueryParams,
  ): Promise<GetVouchers200Response> {
    const whereClause = {
      shop_id: query.shopId,
      is_active: query.isActive,
    };

    const vouchersResult = await this.prisma.vouchers.findMany({
      where: whereClause,
    });

    const vouchers = vouchersResult.map((v) => ({
      voucherId: v.id,
      code: v.code,
      shopId: v.shop_id || '',
      discountType: (v.discount_type as 'fixed' | 'percentage') || 'fixed',
      discountValue: Number(v.discount_value),
      maxDiscount: v.max_discount ? Number(v.max_discount) : undefined,
      minOrderValue: v.min_order_value ? Number(v.min_order_value) : undefined,
      usageLimit: v.usage_limit || undefined,
      usedCount: v.used_count || 0,
      startDate: v.start_date?.toISOString() || '',
      endDate: v.end_date?.toISOString() || '',
      isActive: v.is_active || false,
    }));

    return {
      vouchers,
    };
  }

  async getVoucherById(voucherId: string): Promise<GetVoucherById200Response> {
    const v = await this.prisma.vouchers.findUnique({
      where: { id: voucherId },
    });
    if (!v) {
      throw new NotFoundException('Voucher not found');
    }
    return {
      voucherId: v.id,
      code: v.code,
      shopId: v.shop_id || '',
      discountType: (v.discount_type as 'fixed' | 'percentage') || 'fixed',
      discountValue: Number(v.discount_value),
      maxDiscount: v.max_discount ? Number(v.max_discount) : undefined,
      minOrderValue: v.min_order_value ? Number(v.min_order_value) : undefined,
      usageLimit: v.usage_limit || undefined,
      usedCount: v.used_count || 0,
      startDate: v.start_date?.toISOString() || '',
      endDate: v.end_date?.toISOString() || '',
      isActive: v.is_active || false,
    };
  }

  async updateVoucher(
    voucherId: string,
    data: PatchVoucherBody,
  ): Promise<void> {
    await this.prisma.vouchers.update({
      where: { id: voucherId },
      data: {
        discount_type: data.discountType,
        discount_value: data.discountValue,
        max_discount: data.maxDiscount,
        min_order_value: data.minOrderValue,
        usage_limit: data.usageLimit,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        is_active: data.isActive,
      },
    });
  }

  async createVoucher(data: PostVoucherBody): Promise<string> {
    const existing = await this.prisma.vouchers.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new ConflictException('Voucher code already exists');
    }

    const voucherId = crypto.randomUUID();
    await this.prisma.vouchers.create({
      data: {
        id: voucherId,
        code: data.code,
        shop_id: data.shopId,
        discount_type: data.discountType,
        discount_value: data.discountValue,
        max_discount: data.maxDiscount,
        min_order_value: data.minOrderValue,
        usage_limit: data.usageLimit,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        is_active: data.isActive ?? true,
      },
    });
    return voucherId;
  }
}
