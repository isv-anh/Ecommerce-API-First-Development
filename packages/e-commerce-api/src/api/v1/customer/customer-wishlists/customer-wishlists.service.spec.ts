// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsService } from './customer-wishlists.service';
import { WishlistsRepository } from './customer-wishlists.repository';
import type {
  GetWishlistsQueryParams,
  PostWishlistRequestBody,
} from '@e-commerce/api-validation/types/customer';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    wishlists: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./wishlists.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const wishlistId = '123e4567-e89b-12d3-a456-426614174900';
const userId = '123e4567-e89b-12d3-a456-426614174700';

const mockWishlist = {
  wishlistId,
  userId,
};

const mockWishlistsResponse = {
  wishlists: [mockWishlist],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WishlistsService', () => {
  let service: WishlistsService;
  let repository: jest.Mocked<WishlistsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistsService, WishlistsRepository],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    repository = module.get(WishlistsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteWishlist ──────────────────────────────────────────────────────

  describe('deleteWishlist', () => {
    it('should call repository.deleteWishlist with correct wishlistId', async () => {
      repository.deleteWishlist.mockResolvedValue(undefined);

      await service.deleteWishlist({ wishlistId });

      expect(repository.deleteWishlist).toHaveBeenCalledTimes(1);
      expect(repository.deleteWishlist).toHaveBeenCalledWith(wishlistId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteWishlist.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteWishlist({ wishlistId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getWishlists ───────────────────────────────────────────────────────

  describe('getWishlists', () => {
    const query: GetWishlistsQueryParams = { userId };

    it('should return wishlists from repository', async () => {
      repository.getWishlists.mockResolvedValue(mockWishlistsResponse);

      const result = await service.getWishlists(query);

      expect(repository.getWishlists).toHaveBeenCalledTimes(1);
      expect(repository.getWishlists).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockWishlistsResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getWishlists.mockRejectedValue(new Error('DB error'));

      await expect(service.getWishlists(query)).rejects.toThrow('DB error');
    });
  });

  // ─── getWishlistById ─────────────────────────────────────────────

  describe('getWishlistById', () => {
    it('should return wishlist from repository', async () => {
      repository.getWishlistById.mockResolvedValue(mockWishlist);

      const result = await service.getWishlistById({ wishlistId });

      expect(repository.getWishlistById).toHaveBeenCalledTimes(1);
      expect(repository.getWishlistById).toHaveBeenCalledWith(wishlistId);
      expect(result).toEqual(mockWishlist);
    });

    it('should throw if repository throws', async () => {
      repository.getWishlistById.mockRejectedValue(new Error('Not found'));

      await expect(service.getWishlistById({ wishlistId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── postWishlist ────────────────────────────────────────────────────────

  describe('postWishlist', () => {
    const body: PostWishlistRequestBody = {
      userId,
    };

    it('should return wishlistId after creation', async () => {
      repository.createWishlist.mockResolvedValue(wishlistId);

      const result = await service.postWishlist(body);

      expect(repository.createWishlist).toHaveBeenCalledTimes(1);
      expect(repository.createWishlist).toHaveBeenCalledWith(body);
      expect(result).toEqual({ wishlistId });
    });

    it('should throw if repository throws', async () => {
      repository.createWishlist.mockRejectedValue(new Error('DB error'));

      await expect(service.postWishlist(body)).rejects.toThrow('DB error');
    });
  });
});
