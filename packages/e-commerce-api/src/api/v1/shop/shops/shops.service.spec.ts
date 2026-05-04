// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from './shops.service';
import { ShopsRepository } from './shops.repository';
import type {
  GetShopsQueryParams,
  PatchShopBody,
  PostShopBody,
} from '@e-commerce/api-validation/types/shop';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    shops: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./shops.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const shopId = '123e4567-e89b-12d3-a456-426614175000';
const ownerIds = ['123e4567-e89b-12d3-a456-426614175100'];

const mockShop = {
  shopId,
  ownerId: ownerIds[0],
  name: 'Fashion Store',
  slug: 'fashion-store',
  status: 'active',
  rating: 4.8,
  totalProducts: 150,
  totalOrders: 320,
  createdAt: '2026-04-09T08:00:00.000Z',
  updatedAt: '2026-04-09T08:00:00.000Z',
};

const mockShopsResponse = {
  totalCount: 1,
  totalPages: 1,
  shops: [mockShop],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ShopsService', () => {
  let service: ShopsService;
  let repository: jest.Mocked<ShopsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopsService, ShopsRepository],
    }).compile();

    service = module.get<ShopsService>(ShopsService);
    repository = module.get(ShopsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteShop ──────────────────────────────────────────────────────

  describe('deleteShop', () => {
    it('should call repository.deleteShop with correct shopId', async () => {
      repository.deleteShop.mockResolvedValue(undefined);

      await service.deleteShop({ shopId });

      expect(repository.deleteShop).toHaveBeenCalledTimes(1);
      expect(repository.deleteShop).toHaveBeenCalledWith(shopId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteShop.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteShop({ shopId })).rejects.toThrow('Not found');
    });
  });

  // ─── getShops ───────────────────────────────────────────────────────

  describe('getShops', () => {
    const query: GetShopsQueryParams = {
      page: 1,
      pageSize: 10,
    };

    it('should return shops from repository', async () => {
      repository.getShops.mockResolvedValue(mockShopsResponse);

      const result = await service.getShops(query);

      expect(repository.getShops).toHaveBeenCalledTimes(1);
      expect(repository.getShops).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockShopsResponse);
    });

    it('should pass all query params to repository', async () => {
      const fullQuery: GetShopsQueryParams = {
        ownerIds,
        shop: 'fashion',
        page: 2,
        pageSize: 20,
        orderBy: 'name_desc',
      };
      repository.getShops.mockResolvedValue(mockShopsResponse);

      await service.getShops(fullQuery);

      expect(repository.getShops).toHaveBeenCalledWith(fullQuery);
    });

    it('should throw if repository throws', async () => {
      repository.getShops.mockRejectedValue(new Error('DB error'));

      await expect(service.getShops(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getShopById ─────────────────────────────────────────────

  describe('getShopById', () => {
    it('should return shop from repository', async () => {
      repository.getShopById.mockResolvedValue(mockShop);

      const result = await service.getShopById({ shopId });

      expect(repository.getShopById).toHaveBeenCalledTimes(1);
      expect(repository.getShopById).toHaveBeenCalledWith(shopId);
      expect(result).toEqual(mockShop);
    });

    it('should throw if repository throws', async () => {
      repository.getShopById.mockRejectedValue(new Error('Not found'));

      await expect(service.getShopById({ shopId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchShop ───────────────────────────────────────────────────────

  describe('patchShop', () => {
    const body: PatchShopBody = {
      name: 'Updated Store',
      slug: 'updated-store',
    };

    it('should call repository.updateShop with correct params', async () => {
      repository.updateShop.mockResolvedValue(undefined);

      await service.patchShop({ shopId }, body);

      expect(repository.updateShop).toHaveBeenCalledTimes(1);
      expect(repository.updateShop).toHaveBeenCalledWith(shopId, body);
    });

    it('should throw if repository throws', async () => {
      repository.updateShop.mockRejectedValue(new Error('Conflict'));

      await expect(service.patchShop({ shopId }, body)).rejects.toThrow(
        'Conflict',
      );
    });
  });

  // ─── postShop ────────────────────────────────────────────────────────

  describe('postShop', () => {
    const body: PostShopBody = {
      ownerId: ownerIds[0],
      name: 'Fashion Store',
      slug: 'fashion-store',
    };

    it('should return shopId after creation', async () => {
      repository.createShop.mockResolvedValue(shopId);

      const result = await service.postShop(body);

      expect(repository.createShop).toHaveBeenCalledTimes(1);
      expect(repository.createShop).toHaveBeenCalledWith(body);
      expect(result).toEqual({ shopId });
    });

    it('should throw if repository throws', async () => {
      repository.createShop.mockRejectedValue(new Error('Duplicate slug'));

      await expect(service.postShop(body)).rejects.toThrow('Duplicate slug');
    });
  });
});
