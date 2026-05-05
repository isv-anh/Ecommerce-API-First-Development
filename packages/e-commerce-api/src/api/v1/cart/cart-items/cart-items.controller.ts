import { Injectable } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import type {
  DeleteCartItemParams,
  GetCartItemsParams,
  GetCartItems200Response,
  PatchCartItemParams,
  PatchCartItemBody,
  PostCartItemParams,
  PostCartItemBody,
  PostCartItem201Response,
} from '@e-commerce/api-validation/types/cart';
import { BaseCartItemsControllerInterface } from '@generated-controller/cart/cart-items/base-cart-items.controller.interface';

@Injectable()
export class CartItemsController implements BaseCartItemsControllerInterface {
  constructor(private readonly service: CartItemsService) {}

  /**
   * DELETE /v1/carts/:cartId/items/:productVariantId
   */
  async deleteCartItem(params: DeleteCartItemParams): Promise<void> {
    await this.service.deleteCartItem(params);
  }

  /**
   * GET /v1/carts/:cartId/items
   */
  async getCartItems(
    params: GetCartItemsParams,
  ): Promise<GetCartItems200Response> {
    return await this.service.getCartItems(params);
  }

  /**
   * PATCH /v1/carts/:cartId/items/:productVariantId
   */
  async patchCartItem(
    params: PatchCartItemParams,

    body: PatchCartItemBody,
  ): Promise<void> {
    await this.service.patchCartItem(
      params,

      body,
    );
  }

  /**
   * POST /v1/carts/:cartId/items
   */
  async postCartItem(
    params: PostCartItemParams,

    body: PostCartItemBody,
  ): Promise<PostCartItem201Response> {
    return await this.service.postCartItem(
      params,

      body,
    );
  }
}
