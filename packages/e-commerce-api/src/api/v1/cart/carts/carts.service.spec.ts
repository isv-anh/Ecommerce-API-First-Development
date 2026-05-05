// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { CartsRepository } from './carts.repository';
import type { PostCartBody } from '@e-commerce/api-validation/types/cart';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    carts: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./carts.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const cartId = '123e4567-e89b-12d3-a456-426614174400';
const userId = '123e4567-e89b-12d3-a456-426614174500';

const mockCart = {
  cartId,
  userId,
  updatedAt: '2026-04-09T08:00:00.000Z',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CartsService', () => {
  let service: CartsService;
  let repository: jest.Mocked<CartsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService, CartsRepository],
    }).compile();

    service = module.get<CartsService>(CartsService);
    repository = module.get(CartsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteCart ──────────────────────────────────────────────────────

  describe('deleteCart', () => {
    it('should call repository.deleteCart with correct cartId', async () => {
      repository.deleteCart.mockResolvedValue(undefined);

      await service.deleteCart({ cartId });

      expect(repository.deleteCart).toHaveBeenCalledTimes(1);
      expect(repository.deleteCart).toHaveBeenCalledWith(cartId);
    });
  });

  // ─── getCartByUserId ─────────────────────────────────────────────────

  describe('getCartByUserId', () => {
    it('should return cart from repository', async () => {
      repository.getCartByUserId.mockResolvedValue(mockCart);

      const result = await service.getCartByUserId(userId);

      expect(repository.getCartByUserId).toHaveBeenCalledTimes(1);
      expect(repository.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCart);
    });
  });

  // ─── postCart ────────────────────────────────────────────────────────

  describe('postCart', () => {
    const body: PostCartBody = {
      userId,
    };

    it('should return cartId after creation', async () => {
      repository.createCart.mockResolvedValue(cartId);

      const result = await service.postCart(body);

      expect(repository.createCart).toHaveBeenCalledTimes(1);
      expect(repository.createCart).toHaveBeenCalledWith(body);
      expect(result).toEqual({ cartId });
    });
  });
});
