// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { BrandsRepository } from './brands.repository';
import {
  GetBrandsQueryParams,
  PatchBrandBody,
  PostBrandBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    brands: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./brands.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const brandId = '123e4567-e89b-12d3-a456-426614174000';

const mockBrand = {
  brandId,
  brandName: 'Apple',
  slug: 'apple',
};

const mockBrandsResponse = {
  brands: [mockBrand],
  totalCount: 1,
  totalPages: 1,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BrandsService', () => {
  let service: BrandsService;
  let repository: jest.Mocked<BrandsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsService, BrandsRepository],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    repository = module.get(BrandsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteBrand ──────────────────────────────────────────────────────

  describe('deleteBrand', () => {
    it('should call repository.deleteBrand with correct brandId', async () => {
      repository.deleteBrand.mockResolvedValue(undefined);

      await service.deleteBrand({ brandId });

      expect(repository.deleteBrand).toHaveBeenCalledTimes(1);
      expect(repository.deleteBrand).toHaveBeenCalledWith(brandId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteBrand.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteBrand({ brandId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getBrands ───────────────────────────────────────────────────────

  describe('getBrands', () => {
    const query: GetBrandsQueryParams = { page: 1, pageSize: 10 };

    it('should return brands from repository', async () => {
      repository.getBrands.mockResolvedValue(mockBrandsResponse);

      const result = await service.getBrands(query);

      expect(repository.getBrands).toHaveBeenCalledTimes(1);
      expect(repository.getBrands).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockBrandsResponse);
    });

    it('should pass all query params to repository', async () => {
      const fullQuery: GetBrandsQueryParams = {
        page: 2,
        pageSize: 5,
        brandName: 'Apple',
        slug: 'apple',
      };
      repository.getBrands.mockResolvedValue(mockBrandsResponse);

      await service.getBrands(fullQuery);

      expect(repository.getBrands).toHaveBeenCalledWith(fullQuery);
    });

    it('should throw if repository throws', async () => {
      repository.getBrands.mockRejectedValue(new Error('DB error'));

      await expect(service.getBrands(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getBrandByBrandId ─────────────────────────────────────────────

  describe('getBrandByBrandId', () => {
    it('should return brand from repository', async () => {
      repository.getBrandById.mockResolvedValue(mockBrand);

      const result = await service.getBrandByBrandId({ brandId });

      expect(repository.getBrandById).toHaveBeenCalledTimes(1);
      expect(repository.getBrandById).toHaveBeenCalledWith(brandId);
      expect(result).toEqual(mockBrand);
    });

    it('should throw if repository throws', async () => {
      repository.getBrandById.mockRejectedValue(new Error('Not found'));

      await expect(service.getBrandByBrandId({ brandId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchBrand ───────────────────────────────────────────────────────

  describe('patchBrand', () => {
    const body: PatchBrandBody = {
      brandName: 'Updated Apple',
      slug: 'updated-apple',
    };

    it('should call repository.updateBrand with correct params', async () => {
      repository.updateBrand.mockResolvedValue(undefined);

      await service.patchBrand({ brandId }, body);

      expect(repository.updateBrand).toHaveBeenCalledTimes(1);
      expect(repository.updateBrand).toHaveBeenCalledWith(brandId, body);
    });

    it('should work with partial body', async () => {
      repository.updateBrand.mockResolvedValue(undefined);
      const partialBody: PatchBrandBody = { slug: 'new-slug' };

      await service.patchBrand({ brandId }, partialBody);

      expect(repository.updateBrand).toHaveBeenCalledWith(brandId, partialBody);
    });

    it('should throw if repository throws', async () => {
      repository.updateBrand.mockRejectedValue(new Error('Conflict'));

      await expect(service.patchBrand({ brandId }, body)).rejects.toThrow(
        'Conflict',
      );
    });
  });

  // ─── postBrand ────────────────────────────────────────────────────────

  describe('postBrand', () => {
    const body: PostBrandBody = {
      brandName: 'Apple',
      slug: 'apple',
    };

    it('should return brandId after creation', async () => {
      repository.createBrand.mockResolvedValue(brandId);

      const result = await service.postBrand(body);

      expect(repository.createBrand).toHaveBeenCalledTimes(1);
      expect(repository.createBrand).toHaveBeenCalledWith(body);
      expect(result).toEqual({ brandId });
    });

    it('should throw if repository throws', async () => {
      repository.createBrand.mockRejectedValue(new Error('Duplicate slug'));

      await expect(service.postBrand(body)).rejects.toThrow('Duplicate slug');
    });
  });
});
