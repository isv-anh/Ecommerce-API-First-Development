import { Injectable } from '@nestjs/common';
import { WarehouseInventoriesService } from './warehouse-inventories.service';
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
import { BaseWarehouseInventoriesControllerInterface } from '@generated-controller/product/warehouse-inventories/base-warehouse-inventories.controller.interface';

@Injectable()
export class WarehouseInventoriesController
  implements BaseWarehouseInventoriesControllerInterface
{
  constructor(private readonly service: WarehouseInventoriesService) {}

  /**
   * DELETE /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async deleteWarehouseInventory(
    params: DeleteWarehouseInventoryParams,
  ): Promise<void> {
    await this.service.deleteWarehouseInventory(params);
  }

  /**
   * GET /v1/warehouses-inventories
   */
  async getWarehouseInventories(
    query: GetWarehouseInventoriesQueryParams,
  ): Promise<GetWarehouseInventories200Response> {
    return await this.service.getWarehouseInventories(query);
  }

  /**
   * GET /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async getWarehouseInventoryByIds(
    params: GetWarehouseInventoryByIdsParams,
  ): Promise<GetWarehouseInventoryByIds200Response> {
    return await this.service.getWarehouseInventoryByIds(params);
  }

  /**
   * PATCH /v1/warehouses/:warehouseId/inventories/:productVariantId
   */
  async patchWarehouseInventory(
    params: PatchWarehouseInventoryParams,

    body: PatchWarehouseInventoryBody,
  ): Promise<void> {
    await this.service.patchWarehouseInventory(
      params,

      body,
    );
  }

  /**
   * POST /v1/warehouses-inventories
   */
  async postWarehouseInventory(
    body: PostWarehouseInventoryBody,
  ): Promise<PostWarehouseInventory201Response> {
    return await this.service.postWarehouseInventory(body);
  }
}
