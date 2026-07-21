import { Injectable } from '@nestjs/common';
import type {
  DeleteWarehouseInventoryParams,
  GetWarehouseInventoriesQueryParams,
  GetWarehouseInventories200Response,
  GetWarehouseInventoryByIdsParams,
  GetWarehouseInventoryByIds200Response,
  PatchWarehouseInventoryParams,
  PatchWarehouseInventoryBody,
  PostWarehouseInventoryBody,
  PostWarehouseInventory201Response,
} from '@e-commerce/api-validation/types/product';

import { WarehouseInventoriesRepository } from '@/api/v1/product/warehouse-inventories/warehouse-inventories.repository';
import { BaseWarehouseInventoriesControllerInterface } from '@generated-controller/product/warehouse-inventories/base-warehouse-inventories.controller.interface';

@Injectable()
export class WarehouseInventoriesService implements BaseWarehouseInventoriesControllerInterface {
  constructor(
    private readonly warehouseInventoriesRepository: WarehouseInventoriesRepository,
  ) {}

  /**
   * DELETE /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async deleteWarehouseInventory(
    params: DeleteWarehouseInventoryParams,
  ): Promise<void> {
    await this.warehouseInventoriesRepository.deleteWarehouseInventory(
      params.warehouseId,
      params.productVariantId,
    );
  }

  /**
   * GET /v1/warehouses-inventories
   */
  async getWarehouseInventories(
    query: GetWarehouseInventoriesQueryParams,
  ): Promise<GetWarehouseInventories200Response> {
    return await this.warehouseInventoriesRepository.getWarehouseInventories(
      query,
    );
  }

  /**
   * GET /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async getWarehouseInventoryByIds(
    params: GetWarehouseInventoryByIdsParams,
  ): Promise<GetWarehouseInventoryByIds200Response> {
    return await this.warehouseInventoriesRepository.getWarehouseInventoryByIds(
      params.warehouseId,
      params.productVariantId,
    );
  }

  /**
   * PATCH /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async patchWarehouseInventory(
    params: PatchWarehouseInventoryParams,

    body: PatchWarehouseInventoryBody,
  ): Promise<void> {
    await this.warehouseInventoriesRepository.updateWarehouseInventory(
      params.warehouseId,
      params.productVariantId,
      body,
    );
  }

  /**
   * POST /v1/warehouses-inventories
   */
  async postWarehouseInventory(
    body: PostWarehouseInventoryBody,
  ): Promise<PostWarehouseInventory201Response> {
    const result =
      await this.warehouseInventoriesRepository.createWarehouseInventory(body);
    return result;
  }
}
