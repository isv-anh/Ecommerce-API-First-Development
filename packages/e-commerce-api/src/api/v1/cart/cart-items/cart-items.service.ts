import { Injectable } from '@nestjs/common';
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
import type { BaseCartItemsControllerInterface } from '@generated-controller/cart/cart-items/base-cart-items.controller.interface';
import { CartItemsRepository } from '@/api/v1/cart/cart-items/cart-items.repository';

@Injectable()
export class CartItemsService implements BaseCartItemsControllerInterface {
  constructor(private readonly cartItemsRepository: CartItemsRepository) {}

  /**
   * DELETE /v1/carts/:cartId/items/:productVariantId
   */
  async deleteCartItem(params: DeleteCartItemParams): Promise<void> {
    await this.cartItemsRepository.deleteCartItem(
      params.cartId,
      params.productVariantId,
    );
  }

  /**
   * GET /v1/carts/:cartId/items
   */
  async getCartItems(
    params: GetCartItemsParams,
  ): Promise<GetCartItems200Response> {
    return await this.cartItemsRepository.getCartItems(params.cartId);
  }

  /**
   * PATCH /v1/carts/:cartId/items/:productVariantId
   */
  async patchCartItem(
    params: PatchCartItemParams,

    body: PatchCartItemBody,
  ): Promise<void> {
    await this.cartItemsRepository.updateCartItem(
      params.cartId,
      params.productVariantId,
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
    const result = await this.cartItemsRepository.createCartItem(
      params.cartId,
      body,
    );
    return result;
  }
}
