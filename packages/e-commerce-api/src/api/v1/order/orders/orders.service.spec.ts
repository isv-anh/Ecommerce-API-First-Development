// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    orders: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./orders.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const orderId = '123e4567-e89b-12d3-a456-426614174A00';
const userId = '123e4567-e89b-12d3-a456-426614174B00';

const mockOrder = {
  orderId,
  userId,
  status: 'PENDING',
  totalAmount: 100,
  totalDiscount: 10,
  finalAmount: 90,
  createdAt: '2026-05-03T00:00:00.000Z',
};

const mockOrdersResponse = {
  orders: [mockOrder],
  totalCount: 1,
  totalPages: 1,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, OrdersRepository],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);

    jest.clearAllMocks();
  });

  // ─── deleteOrder ─────────────────────────────────────────────────────────────

  describe('deleteOrder', () => {
    it('should call repository.deleteOrder with correct params', async () => {
      repository.deleteOrder.mockResolvedValue(undefined);

      await service.deleteOrder({ orderId });

      expect(repository.deleteOrder).toHaveBeenCalledTimes(1);
      expect(repository.deleteOrder).toHaveBeenCalledWith(orderId);
    });
  });

  // ─── getOrderById ────────────────────────────────────────────────────────────

  describe('getOrderById', () => {
    it('should return an order from repository', async () => {
      repository.getOrderById.mockResolvedValue(mockOrder);

      const result = await service.getOrderById({ orderId });

      expect(repository.getOrderById).toHaveBeenCalledTimes(1);
      expect(repository.getOrderById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });
  });

  // ─── getOrders ───────────────────────────────────────────────────────────────

  describe('getOrders', () => {
    it('should return orders from repository', async () => {
      repository.getOrders.mockResolvedValue(mockOrdersResponse);

      const query = { page: 1, pageSize: 20, userId };
      const result = await service.getOrders(query);

      expect(repository.getOrders).toHaveBeenCalledTimes(1);
      expect(repository.getOrders).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockOrdersResponse);
    });
  });

  // ─── postOrder ───────────────────────────────────────────────────────────────

  describe('postOrder', () => {
    it('should call repository.createOrder and return id', async () => {
      repository.createOrder.mockResolvedValue(orderId);

      const body = { userId };
      const result = await service.postOrder(body);

      expect(repository.createOrder).toHaveBeenCalledTimes(1);
      expect(repository.createOrder).toHaveBeenCalledWith(body);
      expect(result).toEqual({ orderId });
    });
  });
});
