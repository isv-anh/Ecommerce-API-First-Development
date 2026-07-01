// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { WarehousesRepository } from './warehouses.repository';
import type {
  PatchWarehouseBody,
  PostWarehouseBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    warehouses: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./warehouses.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const warehouseId = '123e4567-e89b-12d3-a456-426614174200';

const mockWarehouse = {
  warehouseId,
  name: 'Main Warehouse',
  address: '123 Industrial Street, Hanoi, Vietnam',
  createdAt: '2026-04-09T08:00:00.000Z',
};

const mockWarehousesResponse = {
  warehouses: [mockWarehouse],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WarehousesService', () => {
  let service: WarehousesService;
  let repository: jest.Mocked<WarehousesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehousesService, WarehousesRepository],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    repository = module.get(WarehousesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteWarehouse ──────────────────────────────────────────────────────

  describe('deleteWarehouse', () => {
    it('should call repository.deleteWarehouse with correct warehouseId', async () => {
      repository.deleteWarehouse.mockResolvedValue(undefined);

      await service.deleteWarehouse({ warehouseId });

      expect(repository.deleteWarehouse).toHaveBeenCalledTimes(1);
      expect(repository.deleteWarehouse).toHaveBeenCalledWith(warehouseId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteWarehouse.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteWarehouse({ warehouseId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getWarehouses ───────────────────────────────────────────────────────

  describe('getWarehouses', () => {
    it('should return warehouses from repository', async () => {
      repository.getWarehouses.mockResolvedValue(mockWarehousesResponse);

      const result = await service.getWarehouses();

      expect(repository.getWarehouses).toHaveBeenCalledTimes(1);
      expect(repository.getWarehouses).toHaveBeenCalledWith();
      expect(result).toEqual(mockWarehousesResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getWarehouses.mockRejectedValue(new Error('DB error'));

      await expect(service.getWarehouses()).rejects.toThrow('DB error');
    });
  });

  // ─── getWarehouseById ─────────────────────────────────────────────

  describe('getWarehouseById', () => {
    it('should return warehouse from repository', async () => {
      repository.getWarehouseById.mockResolvedValue(mockWarehouse);

      const result = await service.getWarehouseById({ warehouseId });

      expect(repository.getWarehouseById).toHaveBeenCalledTimes(1);
      expect(repository.getWarehouseById).toHaveBeenCalledWith(warehouseId);
      expect(result).toEqual(mockWarehouse);
    });

    it('should throw if repository throws', async () => {
      repository.getWarehouseById.mockRejectedValue(new Error('Not found'));

      await expect(service.getWarehouseById({ warehouseId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchWarehouse ───────────────────────────────────────────────────────

  describe('patchWarehouse', () => {
    const body: PatchWarehouseBody = {
      name: 'Updated Warehouse',
    };

    it('should call repository.updateWarehouse with correct params', async () => {
      repository.updateWarehouse.mockResolvedValue(undefined);

      await service.patchWarehouse({ warehouseId }, body);

      expect(repository.updateWarehouse).toHaveBeenCalledTimes(1);
      expect(repository.updateWarehouse).toHaveBeenCalledWith(
        warehouseId,
        body,
      );
    });

    it('should throw if repository throws', async () => {
      repository.updateWarehouse.mockRejectedValue(new Error('Conflict'));

      await expect(
        service.patchWarehouse({ warehouseId }, body),
      ).rejects.toThrow('Conflict');
    });
  });

  // ─── postWarehouse ────────────────────────────────────────────────────────

  describe('postWarehouse', () => {
    const body: PostWarehouseBody = {
      name: 'Main Warehouse',
      address: '123 Industrial Street, Hanoi, Vietnam',
    };

    it('should return warehouseId after creation', async () => {
      repository.createWarehouse.mockResolvedValue(warehouseId);

      const result = await service.postWarehouse(body);

      expect(repository.createWarehouse).toHaveBeenCalledTimes(1);
      expect(repository.createWarehouse).toHaveBeenCalledWith(body);
      expect(result).toEqual({ warehouseId });
    });

    it('should throw if repository throws', async () => {
      repository.createWarehouse.mockRejectedValue(new Error('DB error'));

      await expect(service.postWarehouse(body)).rejects.toThrow('DB error');
    });
  });
});
