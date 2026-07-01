import { PrismaService } from '@/common/services/prisma.service';
import {
  GetWarehouseInventories200Response,
  GetWarehouseInventoriesQueryParams,
  GetWarehouseInventoryByIds200Response,
  PatchWarehouseInventoryBody,
  PostWarehouseInventoryBody,
} from '@e-commerce/api-validation/types/product';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class WarehouseInventoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteWarehouseInventory(
    warehouseId: string,
    productVariantId: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const inventory = await tx.warehouse_inventory.findUnique({
          where: {
            warehouse_id_product_variant_id: {
              warehouse_id: warehouseId,
              product_variant_id: productVariantId,
            },
          },
        });

        if (!inventory) {
          throw new NotFoundException('Warehouse Inventory not found');
        }

        await tx.warehouse_inventory.delete({
          where: {
            warehouse_id_product_variant_id: {
              warehouse_id: warehouseId,
              product_variant_id: productVariantId,
            },
          },
        });

        await tx.product_variants.update({
          where: { id: productVariantId },
          data: {
            stock: {
              decrement: inventory.stock || 0,
            },
          },
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Warehouse Inventory not found');
      }
      throw error;
    }
  }

  async getWarehouseInventories(
    query: GetWarehouseInventoriesQueryParams,
  ): Promise<GetWarehouseInventories200Response> {
    const whereClause = {
      warehouse_id: query.warehouseId,
      product_variant_id: query.productVariantId,
    };

    const inventories = (
      await this.prisma.warehouse_inventory.findMany({
        where: whereClause,
      })
    ).map((inventory) => ({
      warehouseId: inventory.warehouse_id,
      productVariantId: inventory.product_variant_id,
      stock: inventory.stock || 0,
    }));

    return {
      warehouseInventories: inventories,
    };
  }

  async getWarehouseInventoryByIds(
    warehouseId: string,
    productVariantId: string,
  ): Promise<GetWarehouseInventoryByIds200Response> {
    const inventory = await this.prisma.warehouse_inventory.findUnique({
      where: {
        warehouse_id_product_variant_id: {
          warehouse_id: warehouseId,
          product_variant_id: productVariantId,
        },
      },
    });
    if (!inventory) {
      throw new NotFoundException('Warehouse Inventory not found');
    }
    return {
      warehouseId: inventory.warehouse_id,
      productVariantId: inventory.product_variant_id,
      stock: inventory.stock || 0,
    };
  }

  async updateWarehouseInventory(
    warehouseId: string,
    productVariantId: string,
    data: PatchWarehouseInventoryBody,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const inventory = await tx.warehouse_inventory.findUnique({
        where: {
          warehouse_id_product_variant_id: {
            warehouse_id: warehouseId,
            product_variant_id: productVariantId,
          },
        },
      });

      if (!inventory) {
        throw new NotFoundException('Warehouse Inventory not found');
      }

      const nextStock = data.stock ?? inventory.stock ?? 0;
      const stockDelta = nextStock - (inventory.stock || 0);

      await tx.warehouse_inventory.update({
        where: {
          warehouse_id_product_variant_id: {
            warehouse_id: warehouseId,
            product_variant_id: productVariantId,
          },
        },
        data: {
          stock: data.stock,
        },
      });

      await tx.product_variants.update({
        where: { id: productVariantId },
        data: {
          stock: {
            increment: stockDelta,
          },
        },
      });
    });
  }

  async createWarehouseInventory(
    data: PostWarehouseInventoryBody,
  ): Promise<{ warehouseId: string; productVariantId: string }> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.warehouse_inventory.findUnique({
        where: {
          warehouse_id_product_variant_id: {
            warehouse_id: data.warehouseId,
            product_variant_id: data.productVariantId,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Warehouse Inventory already exists');
      }

      await tx.warehouse_inventory.create({
        data: {
          warehouse_id: data.warehouseId,
          product_variant_id: data.productVariantId,
          stock: data.stock,
        },
      });

      await tx.product_variants.update({
        where: { id: data.productVariantId },
        data: {
          stock: {
            increment: data.stock,
          },
        },
      });
    });

    return {
      warehouseId: data.warehouseId,
      productVariantId: data.productVariantId,
    };
  }
}
