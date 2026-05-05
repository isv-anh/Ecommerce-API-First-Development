// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { OrderVouchersService } from './order-vouchers.service';
import { OrderVouchersRepository } from './order-vouchers.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    order_vouchers: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./order-vouchers.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const orderVoucherId = '123e4567-e89b-12d3-a456-426614174A00';
const orderId = '123e4567-e89b-12d3-a456-426614174B00';
const voucherId = '123e4567-e89b-12d3-a456-426614174C00';

const mockOrderVoucher = {
  orderVoucherId,
  orderId,
  voucherId,
  discountAmount: 50,
};

const mockOrderVouchersResponse = {
  orderVouchers: [mockOrderVoucher],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderVouchersService', () => {
  let service: OrderVouchersService;
  let repository: jest.Mocked<OrderVouchersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderVouchersService, OrderVouchersRepository],
    }).compile();

    service = module.get<OrderVouchersService>(OrderVouchersService);
    repository = module.get(OrderVouchersRepository);

    jest.clearAllMocks();
  });

  // ─── deleteOrderVoucher ──────────────────────────────────────────────────────

  describe('deleteOrderVoucher', () => {
    it('should call repository.deleteOrderVoucher with correct params', async () => {
      repository.deleteOrderVoucher.mockResolvedValue(undefined);

      await service.deleteOrderVoucher({ orderVoucherId });

      expect(repository.deleteOrderVoucher).toHaveBeenCalledTimes(1);
      expect(repository.deleteOrderVoucher).toHaveBeenCalledWith(
        orderVoucherId,
      );
    });
  });

  // ─── getOrderVoucherById ─────────────────────────────────────────────────────

  describe('getOrderVoucherById', () => {
    it('should return an order-voucher from repository', async () => {
      repository.getOrderVoucherById.mockResolvedValue(mockOrderVoucher);

      const result = await service.getOrderVoucherById({ orderVoucherId });

      expect(repository.getOrderVoucherById).toHaveBeenCalledTimes(1);
      expect(repository.getOrderVoucherById).toHaveBeenCalledWith(
        orderVoucherId,
      );
      expect(result).toEqual(mockOrderVoucher);
    });
  });

  // ─── getOrderVouchers ────────────────────────────────────────────────────────

  describe('getOrderVouchers', () => {
    it('should return order-vouchers from repository', async () => {
      repository.getOrderVouchers.mockResolvedValue(mockOrderVouchersResponse);

      const result = await service.getOrderVouchers({ orderId });

      expect(repository.getOrderVouchers).toHaveBeenCalledTimes(1);
      expect(repository.getOrderVouchers).toHaveBeenCalledWith({ orderId });
      expect(result).toEqual(mockOrderVouchersResponse);
    });
  });

  // ─── postOrderVoucher ────────────────────────────────────────────────────────

  describe('postOrderVoucher', () => {
    it('should call repository.createOrderVoucher and return id', async () => {
      repository.createOrderVoucher.mockResolvedValue(orderVoucherId);

      const body = { orderId, voucherId, discountAmount: 50 };
      const result = await service.postOrderVoucher(body);

      expect(repository.createOrderVoucher).toHaveBeenCalledTimes(1);
      expect(repository.createOrderVoucher).toHaveBeenCalledWith(body);
      expect(result).toEqual({ orderVoucherId });
    });
  });
});
