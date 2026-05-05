import { Injectable } from '@nestjs/common';
import type {
  DeleteFlashSaleParams,
  GetFlashSaleByIdParams,
  GetFlashSaleById200Response,
  GetFlashSalesQueryParams,
  GetFlashSales200Response,
  PatchFlashSaleParams,
  PatchFlashSaleBody,
  PostFlashSaleBody,
  PostFlashSale201Response,
} from '@e-commerce/api-validation/types/voucher';
import type { BaseFlashSalesControllerInterface } from '@generated-controller/voucher/flash-sales/base-flash-sales.controller.interface';
import { FlashSalesRepository } from '@/api/v1/voucher/flash-sales/flash-sales.repository';

@Injectable()
export class FlashSalesService implements BaseFlashSalesControllerInterface {
  constructor(private readonly flashSalesRepository: FlashSalesRepository) {}

  /**
   * DELETE /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters with flashSaleId
   */
  async deleteFlashSale(params: DeleteFlashSaleParams): Promise<void> {
    await this.flashSalesRepository.deleteFlashSale(params.flashSaleId);
  }

  /**
   * GET /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters with flashSaleId
   * @returns flash sale details
   */
  async getFlashSaleById(
    params: GetFlashSaleByIdParams,
  ): Promise<GetFlashSaleById200Response> {
    return await this.flashSalesRepository.getFlashSaleById(params.flashSaleId);
  }

  /**
   * GET /api/v1/flash-sales
   * @param query - query parameters
   * @returns list of flash sales
   */
  async getFlashSales(
    query: GetFlashSalesQueryParams,
  ): Promise<GetFlashSales200Response> {
    return await this.flashSalesRepository.getFlashSales(query);
  }

  /**
   * PATCH /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters with flashSaleId
   * @param body - partial update data
   */
  async patchFlashSale(
    params: PatchFlashSaleParams,
    body: PatchFlashSaleBody,
  ): Promise<void> {
    await this.flashSalesRepository.updateFlashSale(params.flashSaleId, body);
  }

  /**
   * POST /api/v1/flash-sales
   * @param body - flash sale creation data
   * @returns created flash sale id
   */
  async postFlashSale(
    body: PostFlashSaleBody,
  ): Promise<PostFlashSale201Response> {
    const flashSaleId = await this.flashSalesRepository.createFlashSale(body);
    return { flashSaleId };
  }
}
