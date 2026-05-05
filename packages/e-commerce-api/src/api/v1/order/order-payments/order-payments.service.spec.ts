// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { OrderPaymentsService } from './order-payments.service';
import { OrderPaymentsRepository } from './order-payments.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    payments: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./order-payments.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const orderId = '123e4567-e89b-12d3-a456-426614174A00';
const paymentId = '123e4567-e89b-12d3-a456-426614174B00';

const mockPayment = {
  paymentId,
  orderId,
  method: 'CREDIT_CARD',
  status: 'PENDING',
  amount: 100,
  createdAt: '2026-05-03T00:00:00.000Z',
};

const mockPaymentsResponse = {
  payments: [mockPayment],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OrderPaymentsService', () => {
  let service: OrderPaymentsService;
  let repository: jest.Mocked<OrderPaymentsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderPaymentsService, OrderPaymentsRepository],
    }).compile();

    service = module.get<OrderPaymentsService>(OrderPaymentsService);
    repository = module.get(OrderPaymentsRepository);

    jest.clearAllMocks();
  });

  // ─── deletePayment ───────────────────────────────────────────────────────────

  describe('deletePayment', () => {
    it('should call repository.deletePayment with correct params', async () => {
      repository.deletePayment.mockResolvedValue(undefined);

      await service.deletePayment({ orderId, paymentId });

      expect(repository.deletePayment).toHaveBeenCalledTimes(1);
      expect(repository.deletePayment).toHaveBeenCalledWith(paymentId);
    });
  });

  // ─── getPaymentById ──────────────────────────────────────────────────────────

  describe('getPaymentById', () => {
    it('should return a payment from repository', async () => {
      repository.getPaymentById.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById({ orderId, paymentId });

      expect(repository.getPaymentById).toHaveBeenCalledTimes(1);
      expect(repository.getPaymentById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  // ─── getPayments ─────────────────────────────────────────────────────────────

  describe('getPayments', () => {
    it('should return payments from repository', async () => {
      repository.getPayments.mockResolvedValue(mockPaymentsResponse);

      const result = await service.getPayments({ orderId });

      expect(repository.getPayments).toHaveBeenCalledTimes(1);
      expect(repository.getPayments).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockPaymentsResponse);
    });
  });

  // ─── patchPayment ────────────────────────────────────────────────────────────

  describe('patchPayment', () => {
    it('should call repository.updatePayment with correct params', async () => {
      repository.updatePayment.mockResolvedValue(undefined);

      const body = { status: 'COMPLETED' };
      await service.patchPayment({ orderId, paymentId }, body);

      expect(repository.updatePayment).toHaveBeenCalledTimes(1);
      expect(repository.updatePayment).toHaveBeenCalledWith(paymentId, body);
    });
  });

  // ─── postPayment ─────────────────────────────────────────────────────────────

  describe('postPayment', () => {
    it('should call repository.createPayment and return id', async () => {
      repository.createPayment.mockResolvedValue(paymentId);

      const body = {
        method: 'CREDIT_CARD',
        amount: 100,
      };
      const result = await service.postPayment({ orderId }, body);

      expect(repository.createPayment).toHaveBeenCalledTimes(1);
      expect(repository.createPayment).toHaveBeenCalledWith(orderId, body);
      expect(result).toEqual({ paymentId });
    });
  });
});
