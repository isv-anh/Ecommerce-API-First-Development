// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import type {
  GetCategoriesQueryParams,
  PatchCategoryBody,
  PostCategoryBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    categories: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./categories.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const categoryId = '123e4567-e89b-12d3-a456-426614174000';
const parentId = '123e4567-e89b-12d3-a456-426614174001';

const mockCategory = {
  categoryId,
  categoryName: 'Electronics',
  slug: 'electronics',
};

const mockCategoriesResponse = {
  categories: [mockCategory],
  totalCount: 1,
  totalPages: 1,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<CategoriesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, CategoriesRepository],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(CategoriesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteCategory ──────────────────────────────────────────────────────

  describe('deleteCategory', () => {
    it('should call repository.deleteCategory with correct categoryId', async () => {
      repository.deleteCategory.mockResolvedValue(undefined);

      await service.deleteCategory({ categoryId });

      expect(repository.deleteCategory).toHaveBeenCalledTimes(1);
      expect(repository.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteCategory.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteCategory({ categoryId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getCategories ───────────────────────────────────────────────────────

  describe('getCategories', () => {
    const query: GetCategoriesQueryParams = { page: 1, pageSize: 10 };

    it('should return categories from repository', async () => {
      repository.getCategories.mockResolvedValue(mockCategoriesResponse);

      const result = await service.getCategories(query);

      expect(repository.getCategories).toHaveBeenCalledTimes(1);
      expect(repository.getCategories).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockCategoriesResponse);
    });

    it('should pass all query params to repository', async () => {
      const fullQuery: GetCategoriesQueryParams = {
        page: 2,
        pageSize: 5,
        categoryName: 'Electronics',
        slug: 'electronics',
        parentId,
      };
      repository.getCategories.mockResolvedValue(mockCategoriesResponse);

      await service.getCategories(fullQuery);

      expect(repository.getCategories).toHaveBeenCalledWith(fullQuery);
    });

    it('should throw if repository throws', async () => {
      repository.getCategories.mockRejectedValue(new Error('DB error'));

      await expect(service.getCategories(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getCategoryByCategoryId ─────────────────────────────────────────────

  describe('getCategoryByCategoryId', () => {
    it('should return category from repository', async () => {
      repository.getCategoryById.mockResolvedValue(mockCategory);

      const result = await service.getCategoryByCategoryId({ categoryId });

      expect(repository.getCategoryById).toHaveBeenCalledTimes(1);
      expect(repository.getCategoryById).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(mockCategory);
    });

    it('should throw if repository throws', async () => {
      repository.getCategoryById.mockRejectedValue(new Error('Not found'));

      await expect(
        service.getCategoryByCategoryId({ categoryId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── patchCategory ───────────────────────────────────────────────────────

  describe('patchCategory', () => {
    const body: PatchCategoryBody = {
      categoryName: 'Updated Electronics',
      slug: 'updated-electronics',
    };

    it('should call repository.updateCategory with correct params', async () => {
      repository.updateCategory.mockResolvedValue(undefined);

      await service.patchCategory({ categoryId }, body);

      expect(repository.updateCategory).toHaveBeenCalledTimes(1);
      expect(repository.updateCategory).toHaveBeenCalledWith(categoryId, body);
    });

    it('should work with partial body', async () => {
      repository.updateCategory.mockResolvedValue(undefined);
      const partialBody: PatchCategoryBody = { slug: 'new-slug' };

      await service.patchCategory({ categoryId }, partialBody);

      expect(repository.updateCategory).toHaveBeenCalledWith(
        categoryId,
        partialBody,
      );
    });

    it('should throw if repository throws', async () => {
      repository.updateCategory.mockRejectedValue(new Error('Conflict'));

      await expect(service.patchCategory({ categoryId }, body)).rejects.toThrow(
        'Conflict',
      );
    });
  });

  // ─── postCategory ────────────────────────────────────────────────────────

  describe('postCategory', () => {
    const body: PostCategoryBody = {
      categoryName: 'Electronics',
      slug: 'electronics',
    };

    it('should return categoryId after creation', async () => {
      repository.createCategory.mockResolvedValue(categoryId);

      const result = await service.postCategory(body);

      expect(repository.createCategory).toHaveBeenCalledTimes(1);
      expect(repository.createCategory).toHaveBeenCalledWith(body);
      expect(result).toEqual({ categoryId });
    });

    it('should work with optional parentId', async () => {
      repository.createCategory.mockResolvedValue(categoryId);
      const bodyWithParent: PostCategoryBody = { ...body, parentId };

      const result = await service.postCategory(bodyWithParent);

      expect(repository.createCategory).toHaveBeenCalledWith(bodyWithParent);
      expect(result).toEqual({ categoryId });
    });

    it('should throw if repository throws', async () => {
      repository.createCategory.mockRejectedValue(new Error('Duplicate slug'));

      await expect(service.postCategory(body)).rejects.toThrow(
        'Duplicate slug',
      );
    });
  });
});
