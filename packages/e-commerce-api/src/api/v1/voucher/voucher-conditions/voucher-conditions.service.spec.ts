// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { VoucherConditionsService } from './voucher-conditions.service';
import { VoucherConditionsRepository } from './voucher-conditions.repository';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    voucher_conditions: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./voucher-conditions.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const voucherId = '123e4567-e89b-12d3-a456-426614174B00';
const conditionId = '123e4567-e89b-12d3-a456-426614174C00';

const mockCondition = {
  conditionId,
  voucherId,
  type: 'category',
  refId: '123e4567-e89b-12d3-a456-426614174000',
};

const mockConditionsResponse = {
  voucherConditions: [mockCondition],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('VoucherConditionsService', () => {
  let service: VoucherConditionsService;
  let repository: jest.Mocked<VoucherConditionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherConditionsService, VoucherConditionsRepository],
    }).compile();

    service = module.get<VoucherConditionsService>(VoucherConditionsService);
    repository = module.get(VoucherConditionsRepository);

    jest.clearAllMocks();
  });

  // ─── deleteVoucherCondition ──────────────────────────────────────────────────

  describe('deleteVoucherCondition', () => {
    it('should call repository.deleteVoucherCondition with correct params', async () => {
      repository.deleteVoucherCondition.mockResolvedValue(undefined);

      await service.deleteVoucherCondition({ voucherId, conditionId });

      expect(repository.deleteVoucherCondition).toHaveBeenCalledTimes(1);
      expect(repository.deleteVoucherCondition).toHaveBeenCalledWith(
        conditionId,
      );
    });
  });

  // ─── getVoucherConditions ──────────────────────────────────────────────────

  describe('getVoucherConditions', () => {
    it('should return conditions from repository', async () => {
      repository.getVoucherConditions.mockResolvedValue(mockConditionsResponse);

      const result = await service.getVoucherConditions({ voucherId });

      expect(repository.getVoucherConditions).toHaveBeenCalledTimes(1);
      expect(repository.getVoucherConditions).toHaveBeenCalledWith(voucherId);
      expect(result).toEqual(mockConditionsResponse);
    });
  });
});
