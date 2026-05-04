import { Injectable } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import type {
  DeleteWarehouseParams,
  GetWarehousesQueryParams,
  GetWarehouses200Response,
  GetWarehouseByIdParams,
  GetWarehouseById200Response,
  PatchWarehouseParams,
  PatchWarehouseBody,
  PostWarehouseBody,
  PostWarehouse201Response,
} from '@e-commerce/api-validation/types/product';
import { BaseWarehousesControllerInterface } from '@generated-controller/product/warehouses/base-warehouses.controller.interface';

@Injectable()
export class WarehousesController implements BaseWarehousesControllerInterface {
  constructor(private readonly service: WarehousesService) {}

  /**
   * DELETE /v1/warehouses/:warehouseId
   */
  async deleteWarehouse(params: DeleteWarehouseParams): Promise<void> {
    await this.service.deleteWarehouse(params);
  }

  /**
   * GET /v1/warehouses
   */
  async getWarehouses(
    query: GetWarehousesQueryParams,
  ): Promise<GetWarehouses200Response> {
    return await this.service.getWarehouses(query);
  }

  /**
   * GET /v1/warehouses/:warehouseId
   */
  async getWarehouseById(
    params: GetWarehouseByIdParams,
  ): Promise<GetWarehouseById200Response> {
    return await this.service.getWarehouseById(params);
  }

  /**
   * PATCH /v1/warehouses/:warehouseId
   */
  async patchWarehouse(
    params: PatchWarehouseParams,

    body: PatchWarehouseBody,
  ): Promise<void> {
    await this.service.patchWarehouse(
      params,

      body,
    );
  }

  /**
   * POST /v1/warehouses
   */
  async postWarehouse(
    body: PostWarehouseBody,
  ): Promise<PostWarehouse201Response> {
    return await this.service.postWarehouse(body);
  }
}
