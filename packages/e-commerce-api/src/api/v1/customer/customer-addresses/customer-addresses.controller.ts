import { Injectable } from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
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
import { BaseCustomerAddressesControllerInterface } from '@generated-controller/customer/customer-addresses/base-customer-addresses.controller.interface';

@Injectable()
export class CustomerAddressesController
  implements BaseCustomerAddressesControllerInterface
{
  constructor(private readonly service: CustomerAddressesService) {}

  /**
   * DELETE /v1/addresses/:addressId
   */

  async deleteAddress(params: DeleteAddressParams): Promise<void> {
    await this.service.deleteAddress(params);
  }

  /**
   * GET /v1/addresses
   */
  async getAddresses(): Promise<GetAddresses200Response> {
    return await this.service.getAddresses();
  }

  /**
   * GET /v1/addresses/:addressId
   */
  async getAddressById(
    params: GetAddressByIdParams,
  ): Promise<GetAddressById200Response> {
    return await this.service.getAddressById(params);
  }

  /**
   * PATCH /v1/addresses/:addressId
   */
  async patchAddress(
    params: PatchAddressParams,

    body: PatchAddressBody,
  ): Promise<void> {
    await this.service.patchAddress(
      params,

      body,
    );
  }

  /**
   * POST /v1/addresses
   */
  async postAddress(body: PostAddressBody): Promise<PostAddress201Response> {
    return await this.service.postAddress(body);
  }
}
