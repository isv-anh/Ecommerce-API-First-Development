import { PrismaService } from '@/common/services/prisma.service';
import {
  GetAddresses200Response,
  GetAddressById200Response,
  PatchAddressBody,
  PostAddressBody,
} from '@e-commerce/api-validation/types/customer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CustomerAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deleteAddress(addressId: string): Promise<void> {
    try {
      await this.prisma.addresses.delete({
        where: { id: addressId },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Address not found');
      }
      throw error;
    }
  }

  async getAddresses(): Promise<GetAddresses200Response> {
    const addressesResult = await this.prisma.addresses.findMany();

    const addresses = addressesResult.map((address) => ({
      addressId: address.id,
      userId: address.user_id,
      receiverName: address.receiver_name || '',
      phone: address.phone || '',
      addressLine: address.address_line || '',
      city: address.city || '',
      country: address.country || '',
      isDefault: address.is_default || false,
    }));

    return {
      addresses,
    };
  }

  async getAddressById(addressId: string): Promise<GetAddressById200Response> {
    const address = await this.prisma.addresses.findUnique({
      where: { id: addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      addressId: address.id,
      userId: address.user_id,
      receiverName: address.receiver_name || '',
      phone: address.phone || '',
      addressLine: address.address_line || '',
      city: address.city || '',
      country: address.country || '',
      isDefault: address.is_default || false,
    };
  }

  async updateAddress(
    addressId: string,
    data: PatchAddressBody,
  ): Promise<void> {
    await this.prisma.addresses.update({
      where: { id: addressId },
      data: {
        receiver_name: data.receiverName,
        phone: data.phone,
        address_line: data.addressLine,
        city: data.city,
        country: data.country,
        is_default: data.isDefault,
      },
    });
  }

  async createAddress(data: PostAddressBody): Promise<string> {
    const addressId = crypto.randomUUID();

    // If setting as default, we might need to unset others for this user (depends on business logic, but skipping for simplicity)

    await this.prisma.addresses.create({
      data: {
        id: addressId,
        user_id: data.userId,
        receiver_name: data.receiverName,
        phone: data.phone,
        address_line: data.addressLine,
        city: data.city,
        country: data.country,
        is_default: data.isDefault || false,
      },
    });
    return addressId;
  }
}
