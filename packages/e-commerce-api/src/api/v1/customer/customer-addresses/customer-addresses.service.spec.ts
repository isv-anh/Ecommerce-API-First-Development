// ─── Imports ──────────────────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressesService } from './customer-addresses.service';
import { CustomerAddressesRepository } from './customer-addresses.repository';
import type {
  PatchAddressBody,
  PostAddressBody,
} from '@e-commerce/api-validation/types/customer';

jest.mock('@/common/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    addresses: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

jest.mock('./customer-addresses.repository');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const addressId = '123e4567-e89b-12d3-a456-426614174600';
const userId = '123e4567-e89b-12d3-a456-426614174700';

const mockAddress = {
  addressId,
  userId,
  receiverName: 'Nguyen Van A',
  phone: '0909123456',
  addressLine: '123 Nguyen Trai Street',
  city: 'Hanoi',
  country: 'Vietnam',
  isDefault: true,
};

const mockAddressesResponse = {
  addresses: [mockAddress],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CustomerAddressesService', () => {
  let service: CustomerAddressesService;
  let repository: jest.Mocked<CustomerAddressesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerAddressesService, CustomerAddressesRepository],
    }).compile();

    service = module.get<CustomerAddressesService>(CustomerAddressesService);
    repository = module.get(CustomerAddressesRepository);

    jest.clearAllMocks();
  });

  // ─── deleteAddress ──────────────────────────────────────────────────────

  describe('deleteAddress', () => {
    it('should call repository.deleteAddress with correct addressId', async () => {
      repository.deleteAddress.mockResolvedValue(undefined);

      await service.deleteAddress({ addressId });

      expect(repository.deleteAddress).toHaveBeenCalledTimes(1);
      expect(repository.deleteAddress).toHaveBeenCalledWith(addressId);
    });

    it('should throw if repository throws', async () => {
      repository.deleteAddress.mockRejectedValue(new Error('Not found'));

      await expect(service.deleteAddress({ addressId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── getAddresses ───────────────────────────────────────────────────────

  describe('getAddresses', () => {
    it('should return addresses from repository', async () => {
      repository.getAddresses.mockResolvedValue(mockAddressesResponse);

      const result = await service.getAddresses();

      expect(repository.getAddresses).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAddressesResponse);
    });

    it('should throw if repository throws', async () => {
      repository.getAddresses.mockRejectedValue(new Error('DB error'));

      await expect(service.getAddresses()).rejects.toThrow('DB error');
    });
  });

  // ─── getAddressById ─────────────────────────────────────────────

  describe('getAddressById', () => {
    it('should return address from repository', async () => {
      repository.getAddressById.mockResolvedValue(mockAddress);

      const result = await service.getAddressById({ addressId });

      expect(repository.getAddressById).toHaveBeenCalledTimes(1);
      expect(repository.getAddressById).toHaveBeenCalledWith(addressId);
      expect(result).toEqual(mockAddress);
    });

    it('should throw if repository throws', async () => {
      repository.getAddressById.mockRejectedValue(new Error('Not found'));

      await expect(service.getAddressById({ addressId })).rejects.toThrow(
        'Not found',
      );
    });
  });

  // ─── patchAddress ───────────────────────────────────────────────────────

  describe('patchAddress', () => {
    const body: PatchAddressBody = {
      city: 'Ho Chi Minh',
    };

    it('should call repository.updateAddress with correct params', async () => {
      repository.updateAddress.mockResolvedValue(undefined);

      await service.patchAddress({ addressId }, body);

      expect(repository.updateAddress).toHaveBeenCalledTimes(1);
      expect(repository.updateAddress).toHaveBeenCalledWith(addressId, body);
    });

    it('should throw if repository throws', async () => {
      repository.updateAddress.mockRejectedValue(new Error('DB error'));

      await expect(service.patchAddress({ addressId }, body)).rejects.toThrow(
        'DB error',
      );
    });
  });

  // ─── postAddress ────────────────────────────────────────────────────────

  describe('postAddress', () => {
    const body: PostAddressBody = {
      userId,
      receiverName: 'Nguyen Van A',
      phone: '0909123456',
      addressLine: '123 Nguyen Trai Street',
      city: 'Hanoi',
      country: 'Vietnam',
    };

    it('should return addressId after creation', async () => {
      repository.createAddress.mockResolvedValue(addressId);

      const result = await service.postAddress(body);

      expect(repository.createAddress).toHaveBeenCalledTimes(1);
      expect(repository.createAddress).toHaveBeenCalledWith(body);
      expect(result).toEqual({ addressId });
    });

    it('should throw if repository throws', async () => {
      repository.createAddress.mockRejectedValue(new Error('DB error'));

      await expect(service.postAddress(body)).rejects.toThrow('DB error');
    });
  });
});
