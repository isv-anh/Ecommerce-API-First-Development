// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { OrderShopsService } from './order-shops.service';
import { OrderShopsRepository } from './order-shops.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    order_shops: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./order-shops.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const orderId = '123e4567-e89b-12d3-a456-426614174A00';
const orderShopId = '123e4567-e89b-12d3-a456-426614174B00';
const shopId = '123e4567-e89b-12d3-a456-426614174C00';

const mockOrderShop = {
  orderShopId,
  orderId,
  shopId,
  subtotal: 100,
  discount: 10,
  finalAmount: 90,
  status: 'PENDING',
};

const mockOrderShopsResponse = {
  orderShops: [mockOrderShop],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderShopsService', () => {
  let service: OrderShopsService;
  let repository: jest.Mocked<OrderShopsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderShopsService, OrderShopsRepository],
    }).compile();

    service = module.get<OrderShopsService>(OrderShopsService);
    repository = module.get(OrderShopsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteOrderShop ─────────────────────────────────────────────────────────

  describe('deleteOrderShop', () => {
    it('should call repository.deleteOrderShop with correct params', async () => {
      repository.deleteOrderShop.mockResolvedValue(undefined);

      await service.deleteOrderShop({ orderId, orderShopId });

      expect(repository.deleteOrderShop).toHaveBeenCalledTimes(1);
      expect(repository.deleteOrderShop).toHaveBeenCalledWith(orderShopId);
    });
  });

  // ─── getOrderShopById ────────────────────────────────────────────────────────

  describe('getOrderShopById', () => {
    it('should return an order shop from repository', async () => {
      repository.getOrderShopById.mockResolvedValue(mockOrderShop);

      const result = await service.getOrderShopById({ orderId, orderShopId });

      expect(repository.getOrderShopById).toHaveBeenCalledTimes(1);
      expect(repository.getOrderShopById).toHaveBeenCalledWith(orderShopId);
      expect(result).toEqual(mockOrderShop);
    });
  });

  // ─── getOrderShops ───────────────────────────────────────────────────────────

  describe('getOrderShops', () => {
    it('should return order shops from repository', async () => {
      repository.getOrderShops.mockResolvedValue(mockOrderShopsResponse);

      const result = await service.getOrderShops({ orderId });

      expect(repository.getOrderShops).toHaveBeenCalledTimes(1);
      expect(repository.getOrderShops).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrderShopsResponse);
    });
  });

  // ─── patchOrderShop ──────────────────────────────────────────────────────────

  describe('patchOrderShop', () => {
    it('should call repository.updateOrderShop with correct params', async () => {
      repository.updateOrderShop.mockResolvedValue(undefined);

      const body = { status: 'PAID' };
      await service.patchOrderShop({ orderId, orderShopId }, body);

      expect(repository.updateOrderShop).toHaveBeenCalledTimes(1);
      expect(repository.updateOrderShop).toHaveBeenCalledWith(
        orderShopId,
        body,
      );
    });
  });

  // ─── postOrderShop ───────────────────────────────────────────────────────────

  describe('postOrderShop', () => {
    it('should call repository.createOrderShop and return id', async () => {
      repository.createOrderShop.mockResolvedValue(orderShopId);

      const body = {
        shopId,
        subtotal: 100,
        discount: 10,
        finalAmount: 90,
      };
      const result = await service.postOrderShop({ orderId }, body);

      expect(repository.createOrderShop).toHaveBeenCalledTimes(1);
      expect(repository.createOrderShop).toHaveBeenCalledWith(orderId, body);
      expect(result).toEqual({ orderShopId });
    });
  });
});
