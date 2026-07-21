import { Injectable } from '@nestjs/common';
import type {
  DeleteWishlistParams,
  GetWishlistsQueryParams,
  GetWishlists200Response,
  GetWishlistByIdParams,
  GetWishlistById200Response,
  PostWishlistBody,
  PostWishlist201Response,
} from '@e-commerce/api-validation/types/customer';
import { CustomerWishlistsRepository } from '@/api/v1/customer/customer-wishlists/customer-wishlists.repository';
import { BaseCustomerWishlistsControllerInterface } from '@generated-controller/customer/customer-wishlists/base-customer-wishlists.controller.interface';

@Injectable()
export class CustomerWishlistsService implements BaseCustomerWishlistsControllerInterface {
  constructor(
    private readonly customerWishlistsRepository: CustomerWishlistsRepository,
  ) {}

  /**
   * DELETE /v1/wishlists/:wishlistId
   *
   * @param params - Path parameters typed as {@link DeleteWishlistParams}
   * @returns void
   */
  async deleteWishlist(params: DeleteWishlistParams): Promise<void> {
    await this.customerWishlistsRepository.deleteWishlist(params.wishlistId);
  }

  /**
   * GET /v1/wishlists
   *
   * @param query - Query parameters typed as {@link GetWishlistsQueryParams}
   * @returns {@link GetWishlists200Response}
   */
  async getWishlists(
    query: GetWishlistsQueryParams,
  ): Promise<GetWishlists200Response> {
    return await this.customerWishlistsRepository.getWishlists(query);
  }

  /**
   * GET /v1/wishlists/:wishlistId
   *
   * @param params - Path parameters typed as {@link GetWishlistByIdParams}
   * @returns {@link GetWishlistById200Response}
   */
  async getWishlistById(
    params: GetWishlistByIdParams,
  ): Promise<GetWishlistById200Response> {
    return await this.customerWishlistsRepository.getWishlistById(
      params.wishlistId,
    );
  }

  /**
   * POST /v1/wishlists
   *
   * @param body - Request body typed as {@link PostWishlistBody}
   * @returns {@link PostWishlist201Response}
   */
  async postWishlist(body: PostWishlistBody): Promise<PostWishlist201Response> {
    const wishlistId =
      await this.customerWishlistsRepository.createWishlist(body);
    return { wishlistId };
  }
}
