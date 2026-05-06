// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsRepository } from './product-variants.repository';
import type {
  GetProductVariantsQueryParams,
  PatchProductVariantBody,
  PostProductVariantBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    product_variants: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./product-variants.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const productVariantId = '123e4567-e89b-12d3-a456-426614174100';
const productId = '123e4567-e89b-12d3-a456-426614174000';

const mockProductVariant = {
  productVariantId,
  productId,
  sku: 'SKU-GALAXY-S22-BLACK-256',
  thumbnailUrl: 'https://example.com/images/variants/galaxy-s22-black.jpg',
  price: 1199,
  comparePrice: 1299,
  stock: 50,
  createdAt: '2026-04-09T08:00:00.000Z',
  updatedAt: '2026-04-09T08:00:00.000Z',
};

const mockProductVariantsResponse = {
  productVariants: [mockProductVariant],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProductVariantsService', () => {
  let service: ProductVariantsService;
  let repository: jest.Mocked<ProductVariantsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantsService, ProductVariantsRepository],
    }).compile();

    service = module.get<ProductVariantsService>(ProductVariantsService);
    repository = module.get(ProductVariantsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteProductVariant ──────────────────────────────────────────────────────

  describe('deleteProductVariant', () => {
    it('should call repository.deleteProductVariant with correct productVariantId', async () => {
      repository.deleteProductVariant.mockResolvedValue(undefined);

      await service.deleteProductVariant({ productVariantId });

      expect(repository.deleteProductVariant).toHaveBeenCalledTimes(1);
      expect(repository.deleteProductVariant).toHaveBeenCalledWith(
        productVariantId,
      );
    });

    it('should throw if repository throws', async () => {
      repository.deleteProductVariant.mockRejectedValue(new Error('Not found'));

      await expect(
        service.deleteProductVariant({ productVariantId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── getProductVariants ───────────────────────────────────────────────────────

  describe('getProductVariants', () => {
    const query: GetProductVariantsQueryParams = {};

    it('should return product variants from repository', async () => {
      repository.getProductVariants.mockResolvedValue(
        mockProductVariantsResponse,
      );

      const result = await service.getProductVariants(query);

      expect(repository.getProductVariants).toHaveBeenCalledTimes(1);
      expect(repository.getProductVariants).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockProductVariantsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getProductVariants.mockRejectedValue(new Error('DB error'));

      await expect(service.getProductVariants(query)).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── getProductVariantById ─────────────────────────────────────────────

  describe('getProductVariantById', () => {
    it('should return product variant from repository', async () => {
      repository.getProductVariantById.mockResolvedValue(mockProductVariant);

      const result = await service.getProductVariantById({ productVariantId });

      expect(repository.getProductVariantById).toHaveBeenCalledTimes(1);
      expect(repository.getProductVariantById).toHaveBeenCalledWith(
        productVariantId,
      );
      expect(result).toEqual(mockProductVariant);
    });

    it('should throw if repository throws', async () => {
      repository.getProductVariantById.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(
        service.getProductVariantById({ productVariantId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── patchProductVariant ───────────────────────────────────────────────────────

  describe('patchProductVariant', () => {
    const body: PatchProductVariantBody = {
      price: 1099,
    };

    it('should call repository.updateProductVariant with correct params', async () => {
      repository.updateProductVariant.mockResolvedValue(undefined);

      await service.patchProductVariant({ productVariantId }, body);

      expect(repository.updateProductVariant).toHaveBeenCalledTimes(1);
      expect(repository.updateProductVariant).toHaveBeenCalledWith(
        productVariantId,
        body,
      );
    });

    it('should throw if repository throws', async () => {
      repository.updateProductVariant.mockRejectedValue(new Error('Conflict'));

      await expect(
        service.patchProductVariant({ productVariantId }, body),
      ).rejects.toThrow('Conflict');
    });
  });

  // ─── postProductVariant ────────────────────────────────────────────────────────

  describe('postProductVariant', () => {
    const body: PostProductVariantBody = {
      productId,
      sku: 'SKU-GALAXY-S22-BLACK-256',
      price: 1199,
    };

    it('should return productVariantId after creation', async () => {
      repository.createProductVariant.mockResolvedValue(productVariantId);

      const result = await service.postProductVariant(body);

      expect(repository.createProductVariant).toHaveBeenCalledTimes(1);
      expect(repository.createProductVariant).toHaveBeenCalledWith(body);
      expect(result).toEqual({ productVariantId });
    });

    it('should throw if repository throws', async () => {
      repository.createProductVariant.mockRejectedValue(
        new Error('Duplicate sku'),
      );

      await expect(service.postProductVariant(body)).rejects.toThrow(
        'Duplicate sku',
      );
    });
  });
});
