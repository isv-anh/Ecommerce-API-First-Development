import { PrismaService } from '@/common/services/prisma.service';
import {
  GetWarehouses200Response,
  GetWarehouseById200Response,
  PatchWarehouseBody,
  PostWarehouseBody,
} from '@e-commerce/api-validation/types/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class WarehousesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteWarehouse(warehouseId: string): Promise<void> {
    try {
      await this.prisma.warehouses.delete({
        where: { id: warehouseId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Warehouse not found');
      }
      throw error;
    }
  }

  async getWarehouses(): Promise<GetWarehouses200Response> {
    const warehouses = (await this.prisma.warehouses.findMany()).map(
      (warehouse) => ({
        warehouseId: warehouse.id,
        name: warehouse.name || '',
        address: warehouse.address || '',
        createdAt: warehouse.created_at?.toISOString() || '',
      }),
    );

    return {
      warehouses,
    };
  }

  async getWarehouseById(
    warehouseId: string,
  ): Promise<GetWarehouseById200Response> {
    const warehouse = await this.prisma.warehouses.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return {
      warehouseId: warehouse.id,
      name: warehouse.name || '',
      address: warehouse.address || '',
      createdAt: warehouse.created_at?.toISOString() || '',
    };
  }

  async updateWarehouse(
    warehouseId: string,
    data: PatchWarehouseBody,
  ): Promise<void> {
    await this.prisma.warehouses.update({
      where: { id: warehouseId },
      data: {
        name: data.name,
        address: data.address,
      },
    });
  }

  async createWarehouse(data: PostWarehouseBody): Promise<string> {
    const warehouseId = crypto.randomUUID();
    await this.prisma.warehouses.create({
      data: {
        id: warehouseId,
        name: data.name,
        address: data.address,
      },
    });
    return warehouseId;
  }
}
