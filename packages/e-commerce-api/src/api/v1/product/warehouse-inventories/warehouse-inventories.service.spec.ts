// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseInventoriesService } from './warehouse-inventories.service';
import { WarehouseInventoriesRepository } from './warehouse-inventories.repository';
import type {
  GetWarehouseInventoriesQueryParams,
  PatchWarehouseInventoryBody,
  PostWarehouseInventoryBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    warehouse_inventory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./warehouse-inventories.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const warehouseId = '123e4567-e89b-12d3-a456-426614174200';
const productVariantId = '123e4567-e89b-12d3-a456-426614174100';

const mockWarehouseInventory = {
  warehouseId,
  productVariantId,
  stock: 100,
};

const mockWarehouseInventoriesResponse = {
  warehouseInventories: [mockWarehouseInventory],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WarehouseInventoriesService', () => {
  let service: WarehouseInventoriesService;
  let repository: jest.Mocked<WarehouseInventoriesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseInventoriesService, WarehouseInventoriesRepository],
    }).compile();

    service = module.get<WarehouseInventoriesService>(
      WarehouseInventoriesService,
    );
    repository = module.get(WarehouseInventoriesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteWarehouseInventory ──────────────────────────────────────────────────────

  describe('deleteWarehouseInventory', () => {
    it('should call repository.deleteWarehouseInventory with correct params', async () => {
      repository.deleteWarehouseInventory.mockResolvedValue(undefined);

      await service.deleteWarehouseInventory({ warehouseId, productVariantId });

      expect(repository.deleteWarehouseInventory).toHaveBeenCalledTimes(1);
      expect(repository.deleteWarehouseInventory).toHaveBeenCalledWith(
        warehouseId,
        productVariantId,
      );
    });

    it('should throw if repository throws', async () => {
      repository.deleteWarehouseInventory.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(
        service.deleteWarehouseInventory({ warehouseId, productVariantId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── getWarehouseInventories ───────────────────────────────────────────────────────

  describe('getWarehouseInventories', () => {
    const query: GetWarehouseInventoriesQueryParams = {};

    it('should return inventories from repository', async () => {
      repository.getWarehouseInventories.mockResolvedValue(
        mockWarehouseInventoriesResponse,
      );

      const result = await service.getWarehouseInventories(query);

      expect(repository.getWarehouseInventories).toHaveBeenCalledTimes(1);
      expect(repository.getWarehouseInventories).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockWarehouseInventoriesResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getWarehouseInventories.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.getWarehouseInventories(query)).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── getWarehouseInventoryByIds ─────────────────────────────────────────────

  describe('getWarehouseInventoryByIds', () => {
    it('should return inventory from repository', async () => {
      repository.getWarehouseInventoryByIds.mockResolvedValue(
        mockWarehouseInventory,
      );

      const result = await service.getWarehouseInventoryByIds({
        warehouseId,
        productVariantId,
      });

      expect(repository.getWarehouseInventoryByIds).toHaveBeenCalledTimes(1);
      expect(repository.getWarehouseInventoryByIds).toHaveBeenCalledWith(
        warehouseId,
        productVariantId,
      );
      expect(result).toEqual(mockWarehouseInventory);
    });

    it('should throw if repository throws', async () => {
      repository.getWarehouseInventoryByIds.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(
        service.getWarehouseInventoryByIds({ warehouseId, productVariantId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── patchWarehouseInventory ───────────────────────────────────────────────────────

  describe('patchWarehouseInventory', () => {
    const body: PatchWarehouseInventoryBody = {
      stock: 150,
    };

    it('should call repository.updateWarehouseInventory with correct params', async () => {
      repository.updateWarehouseInventory.mockResolvedValue(undefined);

      await service.patchWarehouseInventory(
        { warehouseId, productVariantId },
        body,
      );

      expect(repository.updateWarehouseInventory).toHaveBeenCalledTimes(1);
      expect(repository.updateWarehouseInventory).toHaveBeenCalledWith(
        warehouseId,
        productVariantId,
        body,
      );
    });

    it('should throw if repository throws', async () => {
      repository.updateWarehouseInventory.mockRejectedValue(
        new Error('Conflict'),
      );

      await expect(
        service.patchWarehouseInventory(
          { warehouseId, productVariantId },
          body,
        ),
      ).rejects.toThrow('Conflict');
    });
  });

  // ─── postWarehouseInventory ────────────────────────────────────────────────────────

  describe('postWarehouseInventory', () => {
    const body: PostWarehouseInventoryBody = {
      warehouseId,
      productVariantId,
      stock: 100,
    };

    it('should return IDs after creation', async () => {
      repository.createWarehouseInventory.mockResolvedValue({
        warehouseId,
        productVariantId,
      });

      const result = await service.postWarehouseInventory(body);

      expect(repository.createWarehouseInventory).toHaveBeenCalledTimes(1);
      expect(repository.createWarehouseInventory).toHaveBeenCalledWith(body);
      expect(result).toEqual({ warehouseId, productVariantId });
    });

    it('should throw if repository throws', async () => {
      repository.createWarehouseInventory.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.postWarehouseInventory(body)).rejects.toThrow(
        'DB error',
      );
    });
  });
});
