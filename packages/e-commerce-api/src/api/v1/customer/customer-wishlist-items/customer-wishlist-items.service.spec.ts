// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWishlistItemsService } from './customer-wishlist-items.service';
import { CustomerWishlistItemsRepository } from './customer-wishlist-items.repository';
import type { PostWishlistItemBody } from '@e-commerce/api-validation/types/customer';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    wishlist_items: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./customer-wishlist-items.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const wishlistId = '123e4567-e89b-12d3-a456-426614174900';
const wishlistItemId = '123e4567-e89b-12d3-a456-426614174A00';
const productId = '123e4567-e89b-12d3-a456-426614174000';

const mockWishlistItem = {
  wishlistItemId,
  wishlistId,
  productId,
};

const mockWishlistItemsResponse = {
  wishlistItems: [mockWishlistItem],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CustomerWishlistItemsService', () => {
  let service: CustomerWishlistItemsService;
  let repository: jest.Mocked<CustomerWishlistItemsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerWishlistItemsService,
        CustomerWishlistItemsRepository,
      ],
    }).compile();

    service = module.get<CustomerWishlistItemsService>(
      CustomerWishlistItemsService,
    );
    repository = module.get(CustomerWishlistItemsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteWishlistItem ──────────────────────────────────────────────────────

  describe('deleteWishlistItem', () => {
    it('should call repository.deleteWishlistItem with correct params', async () => {
      repository.deleteWishlistItem.mockResolvedValue(undefined);

      await service.deleteWishlistItem({ wishlistId, wishlistItemId });

      expect(repository.deleteWishlistItem).toHaveBeenCalledTimes(1);
      expect(repository.deleteWishlistItem).toHaveBeenCalledWith(
        wishlistId,
        wishlistItemId,
      );
    });

    it('should throw if repository throws', async () => {
      repository.deleteWishlistItem.mockRejectedValue(new Error('Not found'));

      await expect(
        service.deleteWishlistItem({ wishlistId, wishlistItemId }),
      ).rejects.toThrow('Not found');
    });
  });

  // ─── getWishlistItems ───────────────────────────────────────────────────────

  describe('getWishlistItems', () => {
    it('should return items from repository', async () => {
      repository.getWishlistItems.mockResolvedValue(mockWishlistItemsResponse);

      const result = await service.getWishlistItems({ wishlistId });

      expect(repository.getWishlistItems).toHaveBeenCalledTimes(1);
      expect(repository.getWishlistItems).toHaveBeenCalledWith(wishlistId);
      expect(result).toEqual(mockWishlistItemsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getWishlistItems.mockRejectedValue(new Error('DB error'));

      await expect(service.getWishlistItems({ wishlistId })).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── postWishlistItem ────────────────────────────────────────────────────────

  describe('postWishlistItem', () => {
    const body: PostWishlistItemBody = {
      productId,
    };

    it('should return wishlistItemId after creation', async () => {
      repository.createWishlistItem.mockResolvedValue(wishlistItemId);

      const result = await service.postWishlistItem({ wishlistId }, body);

      expect(repository.createWishlistItem).toHaveBeenCalledTimes(1);
      expect(repository.createWishlistItem).toHaveBeenCalledWith(
        wishlistId,
        body,
      );
      expect(result).toEqual({ wishlistItemId });
    });

    it('should throw if repository throws', async () => {
      repository.createWishlistItem.mockRejectedValue(new Error('DB error'));

      await expect(
        service.postWishlistItem({ wishlistId }, body),
      ).rejects.toThrow('DB error');
    });
  });
});
