// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { CartItemsService } from './cart-items.service';
import { CartItemsRepository } from './cart-items.repository';
import type {
  PatchCartItemBody,
  PostCartItemBody,
} from '@e-commerce/api-validation/types/cart';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    cart_items: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./cart-items.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const cartId = '123e4567-e89b-12d3-a456-426614174400';
const productVariantId = '123e4567-e89b-12d3-a456-426614174100';

const mockCartItem = {
  cartId,
  productVariantId,
  quantity: 2,
};

const mockCartItemsResponse = {
  cartItems: [mockCartItem],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CartItemsService', () => {
  let service: CartItemsService;
  let repository: jest.Mocked<CartItemsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartItemsService, CartItemsRepository],
    }).compile();

    service = module.get<CartItemsService>(CartItemsService);
    repository = module.get(CartItemsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteCartItem ──────────────────────────────────────────────────────

  describe('deleteCartItem', () => {
    it('should call repository.deleteCartItem with correct params', async () => {
      repository.deleteCartItem.mockResolvedValue(undefined);

      await service.deleteCartItem({ cartId, productVariantId });

      expect(repository.deleteCartItem).toHaveBeenCalledTimes(1);
      expect(repository.deleteCartItem).toHaveBeenCalledWith(
        cartId,
        productVariantId,
      );
    });
  });

  // ─── getCartItems ───────────────────────────────────────────────────────

  describe('getCartItems', () => {
    it('should return items from repository', async () => {
      repository.getCartItems.mockResolvedValue(mockCartItemsResponse);

      const result = await service.getCartItems({ cartId });

      expect(repository.getCartItems).toHaveBeenCalledTimes(1);
      expect(repository.getCartItems).toHaveBeenCalledWith(cartId);
      expect(result).toEqual(mockCartItemsResponse);
    });
  });

  // ─── patchCartItem ───────────────────────────────────────────────────────

  describe('patchCartItem', () => {
    const body: PatchCartItemBody = {
      quantity: 5,
    };

    it('should call repository.updateCartItem with correct params', async () => {
      repository.updateCartItem.mockResolvedValue(undefined);

      await service.patchCartItem({ cartId, productVariantId }, body);

      expect(repository.updateCartItem).toHaveBeenCalledTimes(1);
      expect(repository.updateCartItem).toHaveBeenCalledWith(
        cartId,
        productVariantId,
        body,
      );
    });
  });

  // ─── postCartItem ────────────────────────────────────────────────────────

  describe('postCartItem', () => {
    const body: PostCartItemBody = {
      productVariantId,
      quantity: 2,
    };

    it('should return IDs after creation', async () => {
      repository.createCartItem.mockResolvedValue({ cartId, productVariantId });

      const result = await service.postCartItem({ cartId }, body);

      expect(repository.createCartItem).toHaveBeenCalledTimes(1);
      expect(repository.createCartItem).toHaveBeenCalledWith(cartId, body);
      expect(result).toEqual({ cartId, productVariantId });
    });
  });
});
