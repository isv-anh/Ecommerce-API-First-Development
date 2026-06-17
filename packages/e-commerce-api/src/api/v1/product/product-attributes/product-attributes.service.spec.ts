// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributesRepository } from './product-attributes.repository';
import { PrismaService } from '@/common/services/prisma.service';

import type {
  DeleteProductAttributeParams,
  GetProductAttributeByIdParams,
  GetProductAttributesQueryParams,
  PatchProductAttributeBody,
  PatchProductAttributeParams,
  PostProductAttributeBody,
} from '@e-commerce/api-validation/types/product';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    product_attributes: {
      findUnique: jest.fn(),
    },
  })),
}));

jest.mock('./product-attributes.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const productId = '123e4567-e89b-12d3-a456-426614174000';
const attributeId = '123e4567-e89b-12d3-a456-426614174001';
const newAttributeId = '123e4567-e89b-12d3-a456-426614174002';

const mockProductAttribute = {
  productId,
  attributeId,
  attributeName: 'Color',
};

const mockProductAttributesResponse = {
  productAttributes: [mockProductAttribute],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ProductAttributesService', () => {
  let service: ProductAttributesService;
  let repository: jest.Mocked<ProductAttributesRepository>;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAttributesService,
        ProductAttributesRepository,
        PrismaService,
      ],
    }).compile();

    service = module.get<ProductAttributesService>(ProductAttributesService);

    repository = module.get(ProductAttributesRepository);

    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  // ─── deleteProductAttribute ────────────────────────────────────────────────

  describe('deleteProductAttribute', () => {
    const params: DeleteProductAttributeParams = {
      productId,
      attributeId,
    };

    it('should call repository.deleteProductAttribute', async () => {
      repository.deleteProductAttribute.mockResolvedValue(undefined);

      await service.deleteProductAttribute(params);

      expect(repository.deleteProductAttribute).toHaveBeenCalledTimes(1);

      expect(repository.deleteProductAttribute).toHaveBeenCalledWith(params);
    });

    it('should throw if repository throws', async () => {
      repository.deleteProductAttribute.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.deleteProductAttribute(params)).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getProductAttributes ──────────────────────────────────────────────────

  describe('getProductAttributes', () => {
    const query: GetProductAttributesQueryParams = {
      productId,
    };

    it('should return product attributes from repository', async () => {
      repository.getProductAttributes.mockResolvedValue(
        mockProductAttributesResponse,
      );

      const result = await service.getProductAttributes(query);

      expect(repository.getProductAttributes).toHaveBeenCalledTimes(1);

      expect(repository.getProductAttributes).toHaveBeenCalledWith(query);

      expect(result).toEqual(mockProductAttributesResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getProductAttributes.mockRejectedValue(new Error('DB error'));

      await expect(service.getProductAttributes(query)).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── getProductAttributeById ───────────────────────────────────────────────

  describe('getProductAttributeById', () => {
    const params: GetProductAttributeByIdParams = {
      productId,
      attributeId,
    };

    it('should return product attribute from repository', async () => {
      repository.getProductAttributeById.mockResolvedValue(
        mockProductAttribute,
      );

      const result = await service.getProductAttributeById(params);

      expect(repository.getProductAttributeById).toHaveBeenCalledTimes(1);

      expect(repository.getProductAttributeById).toHaveBeenCalledWith(params);

      expect(result).toEqual(mockProductAttribute);
    });

    it('should throw if repository throws', async () => {
      repository.getProductAttributeById.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.getProductAttributeById(params)).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchProductAttribute ────────────────────────────────────────────────

  describe('patchProductAttribute', () => {
    const params: PatchProductAttributeParams = {
      productId,
      attributeId,
    };

    const body: PatchProductAttributeBody = {
      attributeId: newAttributeId,
    };

    it('should update product attribute successfully', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      repository.updateProductAttribute.mockResolvedValue(undefined);

      await service.patchProductAttribute(params, body);

      expect(prisma.product_attributes.findUnique).toHaveBeenCalledTimes(1);

      expect(prisma.product_attributes.findUnique).toHaveBeenCalledWith({
        where: {
          product_id_attribute_id: {
            product_id: productId,
            attribute_id: newAttributeId,
          },
        },
      });

      expect(repository.updateProductAttribute).toHaveBeenCalledTimes(1);

      expect(repository.updateProductAttribute).toHaveBeenCalledWith(
        params,
        body,
      );
    });

    it('should throw ConflictException if duplicate exists', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue({
        product_id: productId,
        attribute_id: newAttributeId,
      } as never);

      await expect(service.patchProductAttribute(params, body)).rejects.toThrow(
        ConflictException,
      );

      expect(repository.updateProductAttribute).not.toHaveBeenCalled();
    });

    it('should throw if repository throws', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      repository.updateProductAttribute.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.patchProductAttribute(params, body)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  // ─── postProductAttribute ─────────────────────────────────────────────────

  describe('postProductAttribute', () => {
    const body: PostProductAttributeBody = {
      productId,
      attributeId,
    };

    it('should create product attribute successfully', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      repository.createProductAttribute.mockResolvedValue({
        productId: 'new-product-attribute-id',
        attributeId: 'new-attribute-id',
      });

      const result = await service.postProductAttribute(body);

      expect(prisma.product_attributes.findUnique).toHaveBeenCalledTimes(1);

      expect(prisma.product_attributes.findUnique).toHaveBeenCalledWith({
        where: {
          product_id_attribute_id: {
            product_id: productId,
            attribute_id: attributeId,
          },
        },
      });

      expect(repository.createProductAttribute).toHaveBeenCalledTimes(1);

      expect(repository.createProductAttribute).toHaveBeenCalledWith(body);

      expect(result).toEqual({
        productId: 'new-product-attribute-id',
        attributeId: 'new-attribute-id',
      });
    });

    it('should throw ConflictException if duplicate exists', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue({
        product_id: productId,
        attribute_id: attributeId,
      });

      await expect(service.postProductAttribute(body)).rejects.toThrow(
        ConflictException,
      );

      expect(repository.createProductAttribute).not.toHaveBeenCalled();
    });

    it('should throw if repository throws', async () => {
      (prisma.product_attributes.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      repository.createProductAttribute.mockRejectedValue(
        new Error('Create failed'),
      );

      await expect(service.postProductAttribute(body)).rejects.toThrow(
        'Create failed',
      );
    });
  });
});
