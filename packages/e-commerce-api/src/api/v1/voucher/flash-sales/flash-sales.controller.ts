import { Injectable } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import type {
  DeleteFlashSaleParams,
  GetFlashSaleByIdParams,
  GetFlashSaleById200Response,
  GetFlashSales200Response,
  PatchFlashSaleParams,
  PatchFlashSaleBody,
  PostFlashSaleBody,
  PostFlashSale201Response,
} from '@e-commerce/api-validation/types/voucher';
import { BaseFlashSalesControllerInterface } from '@generated-controller/voucher/flash-sales/base-flash-sales.controller.interface';

@Injectable()
export class FlashSalesController implements BaseFlashSalesControllerInterface {
  constructor(private readonly service: FlashSalesService) {}

  /**
   * DELETE /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters
   */
  async deleteFlashSale(params: DeleteFlashSaleParams): Promise<void> {
    await this.service.deleteFlashSale(params);
  }

  /**
   * GET /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters
   * @returns flash sale details
   */
  async getFlashSaleById(
    params: GetFlashSaleByIdParams,
  ): Promise<GetFlashSaleById200Response> {
    return await this.service.getFlashSaleById(params);
  }

  /**
   * GET /api/v1/flash-sales
   * @param query - query parameters
   * @returns list of flash sales
   */
  async getFlashSales(): Promise<GetFlashSales200Response> {
    return await this.service.getFlashSales();
  }

  /**
   * PATCH /api/v1/flash-sales/:flashSaleId
   * @param params - path parameters
   * @param body - partial update data
   */
  async patchFlashSale(
    params: PatchFlashSaleParams,
    body: PatchFlashSaleBody,
  ): Promise<void> {
    await this.service.patchFlashSale(params, body);
  }

  /**
   * POST /api/v1/flash-sales
   * @param body - creation data
   * @returns created flash sale id
   */
  async postFlashSale(
    body: PostFlashSaleBody,
  ): Promise<PostFlashSale201Response> {
    return await this.service.postFlashSale(body);
  }
}
