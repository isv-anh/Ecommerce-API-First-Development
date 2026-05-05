import { PrismaService } from '@/common/services/prisma.service';
import {
  GetFlashSales200Response,
  GetFlashSalesQueryParams,
  GetFlashSaleById200Response,
  PatchFlashSaleBody,
  PostFlashSaleBody,
} from '@e-commerce/api-validation/types/voucher';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class FlashSalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Delete a flash sale by id
   * @param flashSaleId - the flash sale id
   */
  async deleteFlashSale(flashSaleId: string): Promise<void> {
    try {
      await this.prisma.flash_sales.delete({
        where: { id: flashSaleId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Flash Sale not found');
      }
      throw error;
    }
  }

  /**
   * Get a list of flash sales with optional filter by shopId
   * @param query - query parameters including optional shopId
   * @returns list of flash sales
   */
  async getFlashSales(
    query: GetFlashSalesQueryParams,
  ): Promise<GetFlashSales200Response> {
    const result = await this.prisma.flash_sales.findMany({
      where: {
        shop_id: query.shopId,
      },
    });

    const flashSales = result.map((fs) => ({
      flashSaleId: fs.id,
      shopId: fs.shop_id,
      name: fs.name ?? '',
      startTime: fs.start_time?.toISOString() ?? '',
      endTime: fs.end_time?.toISOString() ?? '',
    }));

    return { flashSales };
  }

  /**
   * Get a single flash sale by id
   * @param flashSaleId - the flash sale id
   * @returns flash sale details
   */
  async getFlashSaleById(
    flashSaleId: string,
  ): Promise<GetFlashSaleById200Response> {
    const fs = await this.prisma.flash_sales.findUnique({
      where: { id: flashSaleId },
    });

    if (!fs) {
      throw new NotFoundException('Flash Sale not found');
    }

    return {
      flashSaleId: fs.id,
      shopId: fs.shop_id,
      name: fs.name ?? '',
      startTime: fs.start_time?.toISOString() ?? '',
      endTime: fs.end_time?.toISOString() ?? '',
    };
  }

  /**
   * Update a flash sale by id
   * @param flashSaleId - the flash sale id
   * @param data - partial update data
   */
  async updateFlashSale(
    flashSaleId: string,
    data: PatchFlashSaleBody,
  ): Promise<void> {
    await this.prisma.flash_sales.update({
      where: { id: flashSaleId },
      data: {
        name: data.name,
        start_time: data.startTime ? new Date(data.startTime) : undefined,
        end_time: data.endTime ? new Date(data.endTime) : undefined,
      },
    });
  }

  /**
   * Create a new flash sale
   * @param data - flash sale creation data
   * @returns the new flash sale id
   */
  async createFlashSale(data: PostFlashSaleBody): Promise<string> {
    const flashSaleId = crypto.randomUUID();
    await this.prisma.flash_sales.create({
      data: {
        id: flashSaleId,
        shop_id: data.shopId,
        name: data.name,
        start_time: data.startTime ? new Date(data.startTime) : undefined,
        end_time: data.endTime ? new Date(data.endTime) : undefined,
      },
    });
    return flashSaleId;
  }
}
