import { Injectable } from '@nestjs/common';
import { CustomerWishlistsService } from './customer-wishlists.service';
import type {
  DeleteWishlistParams,
  GetWishlistsQueryParams,
  GetWishlists200Response,
  GetWishlistByIdParams,
  GetWishlistById200Response,
  PostWishlistBody,
  PostWishlist201Response,
} from '@e-commerce/api-validation/types/customer';
import { BaseCustomerWishlistsControllerInterface } from '@generated-controller/customer/customer-wishlists/base-customer-wishlists.controller.interface';

@Injectable()
export class CustomerWishlistsController implements BaseCustomerWishlistsControllerInterface {
  constructor(private readonly service: CustomerWishlistsService) {}

  /**
   * DELETE /v1/wishlists/:wishlistId
   */
  async deleteWishlist(params: DeleteWishlistParams): Promise<void> {
    await this.service.deleteWishlist(params);
  }

  /**
   * GET /v1/wishlists
   */
  async getWishlists(
    query: GetWishlistsQueryParams,
  ): Promise<GetWishlists200Response> {
    return await this.service.getWishlists(query);
  }

  /**
   * GET /v1/wishlists/:wishlistId
   */
  async getWishlistById(
    params: GetWishlistByIdParams,
  ): Promise<GetWishlistById200Response> {
    return await this.service.getWishlistById(params);
  }

  /**
   * POST /v1/wishlists
   */
  async postWishlist(body: PostWishlistBody): Promise<PostWishlist201Response> {
    return await this.service.postWishlist(body);
  }
}
