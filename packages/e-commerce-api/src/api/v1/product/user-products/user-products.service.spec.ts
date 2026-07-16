import { Test, TestingModule } from '@nestjs/testing';
import { UserProductsService } from './user-products.service';
import { ProductsRepository } from '@/api/v1/product/products/products.repository';
import type {
  GetUserProducts200Response,
  GetUserProductsQueryParams,
  GetProductBySlug200Response,
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

jest.mock('@/api/v1/product/products/products.repository');

const productId = '123e4567-e89b-12d3-a456-426614174000';

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

describe('UserProductsService', () => {
  let service: UserProductsService;
  let repository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProductsService, ProductsRepository],
    }).compile();

    service = module.get<UserProductsService>(UserProductsService);
    repository = module.get(ProductsRepository);

    jest.clearAllMocks();
  });

  describe('getUserProducts', () => {
    const query: GetUserProductsQueryParams = { page: 1, pageSize: 10 };

    it('should return products from repository', async () => {
      repository.getUserProducts.mockResolvedValue(
        mockProductsResponse as GetUserProducts200Response,
      );

      const result = await service.getUserProducts(query);

      expect(repository.getUserProducts).toHaveBeenCalledTimes(1);
      expect(repository.getUserProducts).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockProductsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getUserProducts.mockRejectedValue(new Error('DB error'));

      await expect(service.getUserProducts(query)).rejects.toThrow('DB error');
    });
  });

  describe('getProductBySlug', () => {
    const slug = 'samsung-galaxy-s22-ultra';
    const params = { slug };

    it('should return product by slug from repository', async () => {
      const mockResult = {
        productId,
        productName: 'Samsung Galaxy S22 Ultra',
        categoryId: 'cat-id-123',
        slug: 'samsung-galaxy-s22-ultra',
        isPublished: true,
      } as GetProductBySlug200Response;

      repository.getProductBySlug.mockResolvedValue(mockResult);

      const result = await service.getProductBySlug(params);

      expect(repository.getProductBySlug).toHaveBeenCalledTimes(1);
      expect(repository.getProductBySlug).toHaveBeenCalledWith(slug);
      expect(result).toEqual(mockResult);
    });

    it('should throw if repository throws', async () => {
      repository.getProductBySlug.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(service.getProductBySlug(params)).rejects.toThrow(
        'Product not found',
      );
    });
  });
});
