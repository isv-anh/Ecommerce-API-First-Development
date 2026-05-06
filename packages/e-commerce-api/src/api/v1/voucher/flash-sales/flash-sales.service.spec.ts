// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { FlashSalesService } from './flash-sales.service';
import { FlashSalesRepository } from './flash-sales.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    flash_sales: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./flash-sales.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const flashSaleId = '123e4567-e89b-12d3-a456-426614174A00';
const shopId = '123e4567-e89b-12d3-a456-426614174B00';

const mockFlashSale = {
  flashSaleId,
  shopId,
  name: 'Summer Sale',
  startTime: '2026-06-01T00:00:00.000Z',
  endTime: '2026-06-07T23:59:59.000Z',
};

const mockFlashSalesResponse = {
  flashSales: [mockFlashSale],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FlashSalesService', () => {
  let service: FlashSalesService;
  let repository: jest.Mocked<FlashSalesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashSalesService, FlashSalesRepository],
    }).compile();

    service = module.get<FlashSalesService>(FlashSalesService);
    repository = module.get(FlashSalesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteFlashSale ─────────────────────────────────────────────────────────

  describe('deleteFlashSale', () => {
    it('should call repository.deleteFlashSale with correct params', async () => {
      repository.deleteFlashSale.mockResolvedValue(undefined);

      await service.deleteFlashSale({ flashSaleId });

      expect(repository.deleteFlashSale).toHaveBeenCalledTimes(1);
      expect(repository.deleteFlashSale).toHaveBeenCalledWith(flashSaleId);
    });
  });

  // ─── getFlashSaleById ────────────────────────────────────────────────────────

  describe('getFlashSaleById', () => {
    it('should return a flash sale from repository', async () => {
      repository.getFlashSaleById.mockResolvedValue(mockFlashSale);

      const result = await service.getFlashSaleById({ flashSaleId });

      expect(repository.getFlashSaleById).toHaveBeenCalledTimes(1);
      expect(repository.getFlashSaleById).toHaveBeenCalledWith(flashSaleId);
      expect(result).toEqual(mockFlashSale);
    });
  });

  // ─── getFlashSales ───────────────────────────────────────────────────────────

  describe('getFlashSales', () => {
    it('should return flash sales from repository', async () => {
      repository.getFlashSales.mockResolvedValue(mockFlashSalesResponse);

      const result = await service.getFlashSales({ shopId });

      expect(repository.getFlashSales).toHaveBeenCalledTimes(1);
      expect(repository.getFlashSales).toHaveBeenCalledWith({ shopId });
      expect(result).toEqual(mockFlashSalesResponse);
    });
  });

  // ─── patchFlashSale ──────────────────────────────────────────────────────────

  describe('patchFlashSale', () => {
    it('should call repository.updateFlashSale with correct params', async () => {
      repository.updateFlashSale.mockResolvedValue(undefined);

      const body = { name: 'Updated Sale' };
      await service.patchFlashSale({ flashSaleId }, body);

      expect(repository.updateFlashSale).toHaveBeenCalledTimes(1);
      expect(repository.updateFlashSale).toHaveBeenCalledWith(
        flashSaleId,
        body,
      );
    });
  });

  // ─── postFlashSale ───────────────────────────────────────────────────────────

  describe('postFlashSale', () => {
    it('should call repository.createFlashSale and return id', async () => {
      repository.createFlashSale.mockResolvedValue(flashSaleId);

      const body = {
        shopId,
        name: 'Summer Sale',
        startTime: '2026-06-01T00:00:00.000Z',
        endTime: '2026-06-07T23:59:59.000Z',
      };
      const result = await service.postFlashSale(body);

      expect(repository.createFlashSale).toHaveBeenCalledTimes(1);
      expect(repository.createFlashSale).toHaveBeenCalledWith(body);
      expect(result).toEqual({ flashSaleId });
    });
  });
});
