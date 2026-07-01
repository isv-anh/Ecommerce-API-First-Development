// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsService } from './order-items.service';
import { OrderItemsRepository } from './order-items.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    order_items: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./order-items.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const orderId = '123e4567-e89b-12d3-a456-426614174A00';
const orderItemId = '123e4567-e89b-12d3-a456-426614174B00';
const productId = '123e4567-e89b-12d3-a456-426614174D00';
const productVariantId = '123e4567-e89b-12d3-a456-426614174E00';

const mockOrderItem = {
  orderItemId,
  orderId,
  productId,
  productVariantId,
  productName: 'Test Product',
  variantName: 'Red',
  price: 50,
  quantity: 2,
  totalPrice: 100,
};

const mockOrderItemsResponse = {
  orderItems: [mockOrderItem],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let repository: jest.Mocked<OrderItemsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderItemsService, OrderItemsRepository],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    repository = module.get(OrderItemsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteOrderItem ─────────────────────────────────────────────────────────

  describe('deleteOrderItem', () => {
    it('should call repository.deleteOrderItem with correct params', async () => {
      repository.deleteOrderItem.mockResolvedValue(undefined);

      await service.deleteOrderItem({ orderId, orderItemId });

      expect(repository.deleteOrderItem).toHaveBeenCalledTimes(1);
      expect(repository.deleteOrderItem).toHaveBeenCalledWith(orderItemId);
    });
  });

  // ─── getOrderItemById ────────────────────────────────────────────────────────

  describe('getOrderItemById', () => {
    it('should return an order item from repository', async () => {
      repository.getOrderItemById.mockResolvedValue(mockOrderItem);

      const result = await service.getOrderItemById({ orderId, orderItemId });

      expect(repository.getOrderItemById).toHaveBeenCalledTimes(1);
      expect(repository.getOrderItemById).toHaveBeenCalledWith(orderItemId);
      expect(result).toEqual(mockOrderItem);
    });
  });

  // ─── getOrderItems ───────────────────────────────────────────────────────────

  describe('getOrderItems', () => {
    it('should return order items from repository', async () => {
      repository.getOrderItems.mockResolvedValue(mockOrderItemsResponse);

      const result = await service.getOrderItems({ orderId });

      expect(repository.getOrderItems).toHaveBeenCalledTimes(1);
      expect(repository.getOrderItems).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrderItemsResponse);
    });
  });

  // ─── patchOrderItem ──────────────────────────────────────────────────────────

  describe('patchOrderItem', () => {
    it('should call repository.updateOrderItem with correct params', async () => {
      repository.updateOrderItem.mockResolvedValue(undefined);

      const body = { quantity: 3 };
      await service.patchOrderItem({ orderId, orderItemId }, body);

      expect(repository.updateOrderItem).toHaveBeenCalledTimes(1);
      expect(repository.updateOrderItem).toHaveBeenCalledWith(
        orderItemId,
        body,
      );
    });
  });

  // ─── postOrderItem ───────────────────────────────────────────────────────────

  describe('postOrderItem', () => {
    it('should call repository.createOrderItem and return id', async () => {
      repository.createOrderItem.mockResolvedValue(orderItemId);

      const body = {
        productId,
        productVariantId,
        productName: 'Test Product',
        variantName: 'Red',
        price: 50,
        quantity: 2,
      };
      const result = await service.postOrderItem({ orderId }, body);

      expect(repository.createOrderItem).toHaveBeenCalledTimes(1);
      expect(repository.createOrderItem).toHaveBeenCalledWith(orderId, body);
      expect(result).toEqual({ orderItemId });
    });
  });
});
