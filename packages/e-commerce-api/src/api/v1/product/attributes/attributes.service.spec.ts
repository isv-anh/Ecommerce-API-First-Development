// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesRepository } from './attributes.repository';
import type {
  GetAttributesQueryParams,
  PatchAttributeBody,
  PostAttributesBody,
} from '@e-commerce/api-validation/types/product';

jest.mock('./attributes.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const attributeId = '123e4567-e89b-12d3-a456-426614174000';

const mockAttribute = {
  id: attributeId,
  name: 'color',
};

const mockAttributeResponse = {
  attributeId,
  attributeName: 'color',
};

const mockFindAllResult = {
  attributes: [mockAttribute],
  totalCount: 1,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AttributesService', () => {
  let service: AttributesService;
  let repository: jest.Mocked<AttributesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributesService, AttributesRepository],
    }).compile();

    service = module.get<AttributesService>(AttributesService);
    repository = module.get(AttributesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteAttribute ───────────────────────────────────────────────────────

  describe('deleteAttribute', () => {
    it('should call repository.delete with correct attributeId', async () => {
      repository.findById.mockResolvedValue(mockAttribute);
      repository.delete.mockResolvedValue(undefined);

      await service.deleteAttribute({ attributeId });

      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(attributeId);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(attributeId);
    });

    it('should throw NotFoundException if attribute not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteAttribute({ attributeId })).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw if repository.delete throws', async () => {
      repository.findById.mockResolvedValue(mockAttribute);
      repository.delete.mockRejectedValue(new Error('DB error'));

      await expect(service.deleteAttribute({ attributeId })).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── getAttributeById ─────────────────────────────────────────────────────

  describe('getAttributeById', () => {
    it('should return attribute from repository', async () => {
      repository.findById.mockResolvedValue(mockAttribute);

      const result = await service.getAttributeById({ attributeId });

      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(attributeId);
      expect(result).toEqual(mockAttributeResponse);
    });

    it('should throw NotFoundException if attribute not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getAttributeById({ attributeId })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── getattributes ────────────────────────────────────────────────────────

  describe('getattributes', () => {
    const query: GetAttributesQueryParams = {
      page: 1,
      pageSize: 10,
    };

    it('should return paginated attributes from repository', async () => {
      repository.findAll.mockResolvedValue(mockFindAllResult);

      const result = await service.getAttributes(query);

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        totalCount: 1,
        totalPages: 1,
        attributes: [mockAttributeResponse],
      });
    });

    it('should calculate totalPages correctly', async () => {
      repository.findAll.mockResolvedValue({
        attributes: [mockAttribute],
        totalCount: 25,
      });

      const result = await service.getAttributes({ page: 1, pageSize: 10 });

      expect(result.totalPages).toBe(3);
    });

    it('should throw if repository throws', async () => {
      repository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(service.getAttributes(query)).rejects.toThrow('DB error');
    });
  });

  // ─── patchAttribute ───────────────────────────────────────────────────────

  describe('patchAttribute', () => {
    const body: PatchAttributeBody = {
      attributeName: 'size',
    };

    it('should call repository.update with correct params', async () => {
      repository.findById.mockResolvedValue(mockAttribute);

      await service.patchAttribute({ attributeId }, body);

      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(attributeId);
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(attributeId, {
        name: body.attributeName,
      });
    });

    it('should throw NotFoundException if attribute not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.patchAttribute({ attributeId }, body),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw if repository.update throws', async () => {
      repository.findById.mockResolvedValue(mockAttribute);
      repository.update.mockRejectedValue(new Error('Conflict'));

      await expect(
        service.patchAttribute({ attributeId }, body),
      ).rejects.toThrow('Conflict');
    });
  });

  // ─── postattributes ───────────────────────────────────────────────────────

  describe('postattributes', () => {
    const body: PostAttributesBody = {
      attributeName: 'color',
    };

    it('should return attributeId after creation', async () => {
      repository.create.mockResolvedValue(mockAttribute);

      const result = await service.postAttributes(body);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ attributeId });
    });

    it('should throw if repository.create throws', async () => {
      repository.create.mockRejectedValue(new Error('Duplicate name'));

      await expect(service.postAttributes(body)).rejects.toThrow(
        'Duplicate name',
      );
    });
  });
});
