import { Injectable } from '@nestjs/common';
import { CustomerWishlistItemsService } from './customer-wishlist-items.service';
import type {
  DeleteWishlistItemParams,
  GetWishlistItemsParams,
  GetWishlistItems200Response,
  PostWishlistItemParams,
  PostWishlistItemBody,
  PostWishlistItem201Response,
} from '@e-commerce/api-validation/types/customer';

import { BaseCustomerWishlistItemsControllerInterface } from '@generated-controller/customer/customer-wishlist-items/base-customer-wishlist-items.controller.interface';

@Injectable()
export class CustomerWishlistItemsController implements BaseCustomerWishlistItemsControllerInterface {
  constructor(private readonly service: CustomerWishlistItemsService) {}

  /**
   * DELETE /v1/wishlists/:wishlistId/items/:wishlistItemId
   */
  async deleteWishlistItem(params: DeleteWishlistItemParams): Promise<void> {
    await this.service.deleteWishlistItem(params);
  }

  /**
   * GET /v1/wishlists/:wishlistId/items
   */
  async getWishlistItems(
    params: GetWishlistItemsParams,
  ): Promise<GetWishlistItems200Response> {
    return await this.service.getWishlistItems(params);
  }

  /**
   * POST /v1/wishlists/:wishlistId/items
   */
  async postWishlistItem(
    params: PostWishlistItemParams,

    body: PostWishlistItemBody,
  ): Promise<PostWishlistItem201Response> {
    return await this.service.postWishlistItem(
      params,

      body,
    );
  }
}
