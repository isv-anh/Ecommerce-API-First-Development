import { Injectable } from '@nestjs/common';
import type {
  DeleteAddressParams,
  GetAddresses200Response,
  GetAddressByIdParams,
  GetAddressById200Response,
  PatchAddressParams,
  PatchAddressBody,
  PostAddressBody,
  PostAddress201Response,
} from '@e-commerce/api-validation/types/customer';

import { CustomerAddressesRepository } from '@/api/v1/customer/customer-addresses/customer-addresses.repository';
import { BaseCustomerAddressesControllerInterface } from '@generated-controller/customer/customer-addresses/base-customer-addresses.controller.interface';

@Injectable()
export class CustomerAddressesService
  implements BaseCustomerAddressesControllerInterface
{
  constructor(
    private readonly customerAddressesRepository: CustomerAddressesRepository,
  ) {}

  /**
   * DELETE /v1/addresses/:addressId
   *
   * @param params - Path parameters typed as {@link DeleteAddressParams}
   * @returns void
   */
  async deleteAddress(params: DeleteAddressParams): Promise<void> {
    await this.customerAddressesRepository.deleteAddress(params.addressId);
  }

  /**
   * GET /v1/addresses
   *
   * @returns {@link GetAddresses200Response}
   */
  async getAddresses(): Promise<GetAddresses200Response> {
    return await this.customerAddressesRepository.getAddresses();
  }

  /**
   * GET /v1/addresses/:addressId
   *
   * @param params - Path parameters typed as {@link GetAddressByIdParams}
   * @returns {@link GetAddressById200Response}
   */
  async getAddressById(
    params: GetAddressByIdParams,
  ): Promise<GetAddressById200Response> {
    return await this.customerAddressesRepository.getAddressById(
      params.addressId,
    );
  }

  /**
   * PATCH /v1/addresses/:addressId
   *
   * @param params - Path parameters typed as {@link PatchAddressParams}
   * @param body - Request body typed as {@link PatchAddressBody}
   * @returns void
   */
  async patchAddress(
    params: PatchAddressParams,

    body: PatchAddressBody,
  ): Promise<void> {
    await this.customerAddressesRepository.updateAddress(
      params.addressId,
      body,
    );
  }

  /**
   * POST /v1/addresses
   *
   * @param body - Request body typed as {@link PostAddressBody}
   * @returns {@link PostAddress201Response}
   */
  async postAddress(body: PostAddressBody): Promise<PostAddress201Response> {
    const addressId =
      await this.customerAddressesRepository.createAddress(body);
    return { addressId };
  }
}
