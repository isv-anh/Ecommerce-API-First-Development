import { Injectable } from '@nestjs/common';
import type {
  DeleteWishlistItemParams,
  GetWishlistItemsParams,
  GetWishlistItems200Response,
  PostWishlistItemParams,
  PostWishlistItemBody,
  PostWishlistItem201Response,
} from '@e-commerce/api-validation/types/customer';
import { CustomerWishlistItemsRepository } from '@/api/v1/customer/customer-wishlist-items/customer-wishlist-items.repository';
import { BaseCustomerWishlistItemsControllerInterface } from '@generated-controller/customer/customer-wishlist-items/base-customer-wishlist-items.controller.interface';

@Injectable()
export class CustomerWishlistItemsService
  implements BaseCustomerWishlistItemsControllerInterface
{
  constructor(
    private readonly customerWishlistItemsRepository: CustomerWishlistItemsRepository,
  ) {}

  /**
   * DELETE /v1/wishlists/:wishlistId/items/:wishlistItemId
   *
   * @param params - Path parameters typed as {@link DeleteWishlistItemParams}
   * @returns void
   */
  async deleteWishlistItem(params: DeleteWishlistItemParams): Promise<void> {
    await this.customerWishlistItemsRepository.deleteWishlistItem(
      params.wishlistId,
      params.wishlistItemId,
    );
  }

  /**
   * GET /v1/wishlists/:wishlistId/items
   *
   * @param params - Path parameters typed as {@link GetWishlistItemsParams}
   * @returns {@link GetWishlistItems200Response}
   */
  async getWishlistItems(
    params: GetWishlistItemsParams,
  ): Promise<GetWishlistItems200Response> {
    return await this.customerWishlistItemsRepository.getWishlistItems(
      params.wishlistId,
    );
  }

  /**
   * POST /v1/wishlists/:wishlistId/items
   *
   * @param params - Path parameters typed as {@link PostWishlistItemParams}
   * @param body - Request body typed as {@link PostWishlistItemBody}
   * @returns {@link PostWishlistItem201Response}
   */
  async postWishlistItem(
    params: PostWishlistItemParams,

    body: PostWishlistItemBody,
  ): Promise<PostWishlistItem201Response> {
    const wishlistItemId =
      await this.customerWishlistItemsRepository.createWishlistItem(
        params.wishlistId,
        body,
      );
    return { wishlistItemId };
  }
}
