// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { VouchersService } from './vouchers.service';
import { VouchersRepository } from './vouchers.repository';
import type {
  GetVouchersQueryParams,
  PatchVoucherBody,
  PostVoucherBody,
} from '@e-commerce/api-validation/types/voucher';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    vouchers: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./vouchers.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const voucherId = '123e4567-e89b-12d3-a456-426614174B00';
const shopId = '123e4567-e89b-12d3-a456-426614174300';

const mockVoucher = {
  voucherId,
  code: 'SUMMER2026',
  shopId,
  discountType: 'fixed' as const,
  discountValue: 50,
  maxDiscount: 50,
  minOrderValue: 200,
  usageLimit: 100,
  usedCount: 10,
  startDate: '2026-04-09T08:00:00.000Z',
  endDate: '2026-05-09T08:00:00.000Z',
  isActive: true,
};

const mockVouchersResponse = {
  vouchers: [mockVoucher],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('VouchersService', () => {
  let service: VouchersService;
  let repository: jest.Mocked<VouchersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VouchersService, VouchersRepository],
    }).compile();

    service = module.get<VouchersService>(VouchersService);
    repository = module.get(VouchersRepository);

    jest.clearAllMocks();
  });

  // ─── deleteVoucher ──────────────────────────────────────────────────────

  describe('deleteVoucher', () => {
    it('should call repository.deleteVoucher with correct voucherId', async () => {
      repository.deleteVoucher.mockResolvedValue(undefined);

      await service.deleteVoucher({ voucherId });

      expect(repository.deleteVoucher).toHaveBeenCalledTimes(1);
      expect(repository.deleteVoucher).toHaveBeenCalledWith(voucherId);
    });
  });

  // ─── getVouchers ───────────────────────────────────────────────────────

  describe('getVouchers', () => {
    const query: GetVouchersQueryParams = {};

    it('should return vouchers from repository', async () => {
      repository.getVouchers.mockResolvedValue(mockVouchersResponse);

      const result = await service.getVouchers(query);

      expect(repository.getVouchers).toHaveBeenCalledTimes(1);
      expect(repository.getVouchers).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockVouchersResponse);
    });
  });

  // ─── getVoucherById ─────────────────────────────────────────────

  describe('getVoucherById', () => {
    it('should return voucher from repository', async () => {
      repository.getVoucherById.mockResolvedValue(mockVoucher);

      const result = await service.getVoucherById({ voucherId });

      expect(repository.getVoucherById).toHaveBeenCalledTimes(1);
      expect(repository.getVoucherById).toHaveBeenCalledWith(voucherId);
      expect(result).toEqual(mockVoucher);
    });
  });

  // ─── patchVoucher ───────────────────────────────────────────────────────

  describe('patchVoucher', () => {
    const body: PatchVoucherBody = {
      isActive: false,
    };

    it('should call repository.updateVoucher with correct params', async () => {
      repository.updateVoucher.mockResolvedValue(undefined);

      await service.patchVoucher({ voucherId }, body);

      expect(repository.updateVoucher).toHaveBeenCalledTimes(1);
      expect(repository.updateVoucher).toHaveBeenCalledWith(voucherId, body);
    });
  });

  // ─── postVoucher ────────────────────────────────────────────────────────

  describe('postVoucher', () => {
    const body: PostVoucherBody = {
      code: 'SUMMER2026',
      shopId,
      discountType: 'fixed',
      discountValue: 50,
      startDate: '2026-04-09T08:00:00.000Z',
      endDate: '2026-05-09T08:00:00.000Z',
    };

    it('should return voucherId after creation', async () => {
      repository.createVoucher.mockResolvedValue(voucherId);

      const result = await service.postVoucher(body);

      expect(repository.createVoucher).toHaveBeenCalledTimes(1);
      expect(repository.createVoucher).toHaveBeenCalledWith(body);
      expect(result).toEqual({ voucherId });
    });
  });
});
