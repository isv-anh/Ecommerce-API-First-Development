// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import type {
  GetProductsQueryParams,
  PatchProductBody,
  PostProductBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    products: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

jest.mock('./products.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const productId = '123e4567-e89b-12d3-a456-426614174000';
const categoryId = '123e4567-e89b-12d3-a456-426614174001';

const mockProduct = {
  productId,
  productName: 'Samsung Galaxy S22 Ultra',
  categoryName: 'Smartphones',
  thumbnailUrl:
    'https://i.pinimg.com/736x/82/e7/d5/82e7d52336cff4e9d9fa9dfc7d307790.jpg',

  slug: 'samsung-galaxy-s22-ultra',
};

const mockProductsResponse = {
  products: [mockProduct],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductsRepository],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteProduct ──────────────────────────────────────────────────────

  describe('deleteProduct', () => {
    it('should call repository.deleteProduct with correct productId', async () => {
      repository.deleteProduct.mockResolvedValue(undefined);

      await service.deleteProduct({ productId });

      expect(repository.deleteProduct).toHaveBeenCalledTimes(1);
      expect(repository.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteProduct.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteProduct({ productId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getProducts ───────────────────────────────────────────────────────

  describe('getProducts', () => {
    const query: GetProductsQueryParams = { page: 1, pageSize: 10 };

    it('should return products from repository', async () => {
      repository.getProducts.mockResolvedValue(mockProductsResponse);

      const result = await service.getProducts(query);

      expect(repository.getProducts).toHaveBeenCalledTimes(1);
      expect(repository.getProducts).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockProductsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getProducts.mockRejectedValue(new Error('DB error'));

      await expect(service.getProducts(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getProductByProductId ─────────────────────────────────────────────

  describe('getProductByProductId', () => {
    it('should return product from repository', async () => {
      repository.getProductById.mockResolvedValue(mockProduct);

      const result = await service.getProductByProductId({ productId });

      expect(repository.getProductById).toHaveBeenCalledTimes(1);
      expect(repository.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should throw if repository throws', async () => {
      repository.getProductById.mockRejectedValue(new Error('Not found'));

      await expect(
        service.getProductByProductId({ productId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── patchProduct ───────────────────────────────────────────────────────

  describe('patchProduct', () => {
    const body: PatchProductBody = {
      productName: 'Updated Samsung Galaxy S22 Ultra',
      slug: 'updated-samsung-galaxy-s22-ultra',
    };

    it('should call repository.updateProduct with correct params', async () => {
      repository.updateProduct.mockResolvedValue(undefined);

      await service.patchProduct({ productId }, body);

      expect(repository.updateProduct).toHaveBeenCalledTimes(1);
      expect(repository.updateProduct).toHaveBeenCalledWith(productId, body);
    });

    it('should throw if repository throws', async () => {
      repository.updateProduct.mockRejectedValue(new Error('Conflict'));

      await expect(service.patchProduct({ productId }, body)).rejects.toThrow(
        'Conflict',
      );
    });
  });

  // ─── postProduct ────────────────────────────────────────────────────────

  describe('postProduct', () => {
    const body: PostProductBody = {
      productName: 'Samsung Galaxy S22 Ultra',
      description: 'The latest Samsung smartphone with advanced features.',
      categoryId,
      slug: 'samsung-galaxy-s22-ultra',
    };

    it('should return productId after creation', async () => {
      repository.createProduct.mockResolvedValue(productId);

      const result = await service.postProduct(body);

      expect(repository.createProduct).toHaveBeenCalledTimes(1);
      expect(repository.createProduct).toHaveBeenCalledWith(body);
      expect(result).toEqual({ productId });
    });

    it('should throw if repository throws', async () => {
      repository.createProduct.mockRejectedValue(new Error('Duplicate slug'));

      await expect(service.postProduct(body)).rejects.toThrow('Duplicate slug');
    });
  });
});
