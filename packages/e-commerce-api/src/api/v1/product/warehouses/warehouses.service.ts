import { Injectable } from '@nestjs/common';
import type {
  DeleteWarehouseParams,
  GetWarehouses200Response,
  GetWarehouseByIdParams,
  GetWarehouseById200Response,
  PatchWarehouseParams,
  PatchWarehouseBody,
  PostWarehouseBody,
  PostWarehouse201Response,
} from '@e-commerce/api-validation/types/product';
import type { BaseWarehousesControllerInterface } from '@generated-controller/product/warehouses/base-warehouses.controller.interface';
import { WarehousesRepository } from '@/api/v1/product/warehouses/warehouses.repository';

@Injectable()
export class WarehousesService implements BaseWarehousesControllerInterface {
  constructor(private readonly warehousesRepository: WarehousesRepository) {}

  /**
   * DELETE /v1/warehouses/:warehouseId
   */
  async deleteWarehouse(params: DeleteWarehouseParams): Promise<void> {
    await this.warehousesRepository.deleteWarehouse(params.warehouseId);
  }

  /**
   * GET /v1/warehouses
   */
  async getWarehouses(): Promise<GetWarehouses200Response> {
    return await this.warehousesRepository.getWarehouses();
  }

  /**
   * GET /v1/warehouses/:warehouseId
   */
  async getWarehouseById(
    params: GetWarehouseByIdParams,
  ): Promise<GetWarehouseById200Response> {
    return await this.warehousesRepository.getWarehouseById(params.warehouseId);
  }

  /**
   * PATCH /v1/warehouses/:warehouseId
   */
  async patchWarehouse(
    params: PatchWarehouseParams,

    body: PatchWarehouseBody,
  ): Promise<void> {
    await this.warehousesRepository.updateWarehouse(params.warehouseId, body);
  }

  /**
   * POST /v1/warehouses
   */
  async postWarehouse(
    body: PostWarehouseBody,
  ): Promise<PostWarehouse201Response> {
    const warehouseId = await this.warehousesRepository.createWarehouse(body);
    return { warehouseId };
  }
}
